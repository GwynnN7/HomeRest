import fs from 'fs';
import express, { json } from "express";
import cors from "cors";
import webpush from "web-push";

const port = 3000;
const app = express();
app.use(json());
app.use(cors());

let dummyData = {}
let realData = loadFileSync('./data/real_devices.json')

let subscriptions = loadFileSync('./data/subscriptions.json')
let lastNotifyData = undefined

if(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY){
  webpush.setVapidDetails(
      'mailto:mattcheru03@gmail.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
  );
}

function loadFileSync(path){
  try{
    const data = fs.readFileSync(path);
    return JSON.parse(data);
  }
  catch{
    fs.writeFileSync(path, JSON.stringify({}, null, 2), 'utf8');
    return {}
  }
}

// Dummy Devices

app.use('/dummy', async (req, res, next) => {
  fs.readFile('./data/dummy_devices.json', (err, data) => {
    try{
      if (err) throw err;
      dummyData = JSON.parse(data);
      next();
    }
    catch{
      res.status(500).send({ error: 'Devices could not be loaded' });
    }
  });
});

app.get('/dummy', (req, res) => {
  res.json(dummyData);
});

app.get('/dummy/sensors', (req, res) => {
  res.json(dummyData.sensors);
});

app.get('/dummy/devices', (req, res) => {
  res.json(dummyData.devices);
});

app.get('/dummy/sensors/:name', (req, res) => {
  const sensor = dummyData.sensors.find(s => s.sensor.toLowerCase() === req.params.name.toLowerCase());
  if (!sensor) return res.status(404).send({ error: 'Sensor not found' });

  res.json({ sensor: sensor.sensor, value: sensor.value, unit: sensor.unit });
});

app.get('/dummy/devices/:name', (req, res) => {
  const device = dummyData.devices.find(d => d.device.toLowerCase() === req.params.name.toLowerCase());
  if (!device) return res.status(404).send({ error: 'Device not found' });

  res.json({ device: device.device, status: device.status });
});

app.post('/dummy/devices/:name', (req, res) => {
  if(!req.body) return res.status(400).send({ error: 'Missing request body' });

  const action  = req.body.action;
  const device = dummyData.devices.find(d => d.device.toLowerCase() === req.params.name.toLowerCase());

  if (!device) return res.status(404).send({ error: 'Device not found' });
  if(!action) return res.status(400).send({ error: 'Missing action field in body' });

  const actionValue = action.toLowerCase();

  if (!device.actions.includes(actionValue)) {
    return res.status(400).send({ error: 'Action not supported by this device' });
  }

  if(actionValue === "toggle") {
    device.status = device.status === 'on' ? 'off' : 'on';
  }
  else {
    device.status = actionValue;
  }

  fs.writeFile('./data/dummy_devices.json', JSON.stringify(dummyData, null, 4), (err) => {
    if (err) return res.sendStatus(500).send({ error: 'Device status could not be updated' });

    res.json({ device: device.device, status: device.status });
  });
});

function updateDummySensors() {
  fetch(`http://localhost:${port}/dummy/sensors`)
      .then(res => res.json())
      .then(sensors => {
        sensors.forEach(s => {
          if(Math.random() < 0.5)
          {
            if(s.value === 'true') s.value = 'false'
            else if(s.value === 'false') s.value = 'true'
            else{
              const increment = Math.round(Math.random() * 4) - 2;
              s.value = (parseFloat(s.value) + increment).toString();
            }
          }
        })
        dummyData.sensors = sensors;
        fs.writeFileSync('./data/dummy_devices.json', JSON.stringify(dummyData, null, 4), "utf8");
      })
      .catch(_ => {});
}

// Real Devices

app.get('/real/sensors/:name', async (req, res) => {
  const sensor = realData.sensors.find(d => d.sensor.toLowerCase() === req.params.name.toLowerCase());

  if (!sensor) return res.status(404).send({error: 'Sensor not found'});

  try{
    const result = await fetch(sensor.endpoint, {method: "GET", headers: { 'Content-Type': 'application/json' }});
    const data = await result.json();
    res.json(data);
  }
  catch {
    res.status(500).send({error: 'Sensor not reachable'});
  }
});

app.get('/real/devices/:name', async (req, res) => {
  const device = realData.devices.find(d => d.device.toLowerCase() === req.params.name.toLowerCase());

  if (!device) return res.status(404).send({ error: 'Device not found' });

  try{
    const result = await fetch(device.endpoint, {method: "GET", headers: { 'Content-Type': 'application/json' }});
    const data = await result.json();
    res.json(data);
  }
  catch {
    res.status(500).send({error: 'Device not reachable'});
  }
});

app.post('/real/devices/:name', async (req, res) => {
  if(!req.body) return res.status(400).send({ error: 'Missing request body' });

  const action  = req.body.action;
  const device = realData.devices.find(d => d.device.toLowerCase() === req.params.name.toLowerCase());

  if (!device) return res.status(404).send({ error: 'Device not found' });
  if(!action) return res.status(400).send({ error: 'Missing action field in body' });

  try{
    const result = await fetch(device.endpoint, {method: "POST", body: JSON.stringify({action: action}), headers: { 'Content-Type': 'application/json' }});
    const data = await result.json();
    res.json(data);
  }
  catch {
    res.status(500).send({error: 'Device not reachable'});
  }
});

// Subscriptions & Notifications

app.post('/:type/:category/:name/:action', (req, res) => {
  if(!(["subscribe", "unsubscribe"].includes(req.params.action))) return res.status(400).send({ error: 'Invalid action' });

  const subscription = req.body.subscription;
  if(!subscription.keys || !subscription.keys.auth) {
    return res.status(400).send({ error: 'Missing subscription details' });
  }
  const authKey = subscription.keys.auth;

  const uid = req.body.uid;
  if(!uid){
    return res.status(403).send({ error: 'Authentication required' });
  }

  let list = []
  if(req.params.type === 'real') list = realData;
  else if(req.params.type === 'dummy') list = dummyData;
  else return res.status(404).send({ error: 'Type not found' });

  if(req.params.category === "devices"){
    const device = list.devices.find(d => d.device.toLowerCase() === req.params.name.toLowerCase());
    if (!device) return res.status(404).send({ error: 'Device not found' });
  }
  else if(req.params.category  === "sensors") {
    const sensor = list.sensors.find(s => s.sensor.toLowerCase() === req.params.name.toLowerCase());
    if (!sensor) return res.status(404).send({ error: 'Sensor not found' });
  }
  else return res.status(404).send({ error: 'Category not found' });

  const endpoint = `${req.params.type.toLowerCase()}/${req.params.category.toLowerCase()}/${req.params.name.toLowerCase()}`;

  if(!subscriptions[authKey])
  {
    subscriptions[authKey] = {
      subscription: subscription,
      data: []
    }
  }

  let dataIndex = subscriptions[authKey].data.findIndex(data => data.uid === uid)
  if(dataIndex === -1)
  {
    if(req.params.action === "subscribe"){
      dataIndex = subscriptions[authKey].data.push({uid: uid, endpoints: []}) - 1
    }
    else return res.sendStatus(200);
  }

  const endpointIndex = subscriptions[authKey].data[dataIndex].endpoints.indexOf(endpoint)
  if(req.params.action === "subscribe") {
    if(endpointIndex === -1) {
      subscriptions[authKey].data[dataIndex].endpoints.push(endpoint)
    }
  }
  else {
    if(endpointIndex !== -1) {
      subscriptions[authKey].data[dataIndex].endpoints.splice(endpointIndex, 1);
    }
  }

  fs.writeFileSync('./data/subscriptions.json', JSON.stringify(subscriptions, null, 4), "utf8");
  res.status(200).send({ message: 'Subscription updated' });
});


async function sendNotifications() {
  const result = await fetch(`http://localhost:${port}/dummy`);
  const dummyResults = await result.json();

  const realResults = {}
  for(const devType of ["devices", "sensors"]) {
    realResults[devType] = []
    for(const dev of realData[devType]) {
      const result = await fetch(dev.endpoint, {method: "GET", headers: { 'Content-Type': 'application/json' }});
      const data = await result.json();
      realResults[devType].push(data);
    }
  }

  const data = {
    real: {
      devices: realResults.devices,
      sensors: realResults.sensors,
    },
    dummy: {
      devices: dummyResults.devices,
      sensors: dummyResults.sensors,
    }
  };

  if (lastNotifyData === undefined) {
    lastNotifyData = data;
    return;
  }

  try{
    let expiredSubscriptions = []
    for (const [root, deviceObject] of Object.entries(data)) {
      for(const [type, devices]  of Object.entries(deviceObject)){
        for (const [auth, subscription] of Object.entries(subscriptions)) {
          for (const sub of subscription.data) {

            const updates = []
            devices.forEach((device, index) => {
              const deviceType = type.toLowerCase() === "devices" ? "device" : "sensor"
              if (sub.endpoints.findIndex(item => item === `${root}/${type}/${device[deviceType].toLowerCase()}`) !== -1) {
                if (deviceType === "device") {
                  if (device.status !== lastNotifyData[root][type][index].status) {
                    updates.push(`${device[deviceType]}: ${device.status.toUpperCase()}`);
                  }
                } else {
                  if (device.value !== lastNotifyData[root][type][index].value) {
                    updates.push(`${device[deviceType]}: ${device.value.toUpperCase()}${device.unit}`);
                  }
                }
              }
            })

            if (updates.length > 0) {
              const payload = JSON.stringify({
                text: updates.join(' ~ '),
                uid: sub.uid
              });

              try {
                await webpush.sendNotification(subscription.subscription, payload)
              } catch {
                expiredSubscriptions.push(auth)
              }
            }
          }
        }
      }
    }
    lastNotifyData = data;
    expiredSubscriptions.forEach(sub => {
      delete subscriptions[sub];
    })
    if (expiredSubscriptions.length > 0) {
      fs.writeFileSync('./data/subscriptions.json', JSON.stringify(subscriptions, null, 4), "utf8");
    }
  }
  catch {}
}

setInterval(updateDummySensors, 5000);
setInterval(sendNotifications, 2000);

app.listen(port, () => {
  console.log(`Devices API server running at http://localhost:${port}`);
});
