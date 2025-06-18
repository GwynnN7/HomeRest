const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const realData = require('./devices/real_devices.json');
let dummyData = {}

app.use('/dummy', async (req, res, next) => {
  fs.readFile('./devices/dummy_devices.json', (err, data) => {
    if (err) return res.sendStatus(500).send({ error: 'Devices could not be loaded' });

    dummyData = JSON.parse(data);
    next();
  });
});

// Dummy Devices

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
  const sensor = dummyData.sensors.find(s => s.name.toLowerCase() === req.params.name.toLowerCase());
  if (!sensor) return res.status(404).send({ error: 'Sensor not found' });

  res.json({ sensor: sensor.name, value: sensor.value, unit: sensor.unit });
});

app.get('/dummy/devices/:name', (req, res) => {
  const device = dummyData.devices.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());
  if (!device) return res.status(404).send({ error: 'Device not found' });

  res.json({ device: device.name, status: device.status });
});

app.post('/dummy/devices/:name', (req, res) => {
  if(!req.body) return res.status(400).send({ error: 'Missing request body' });

  const { action } = req.body;
  const device = dummyData.devices.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());

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

  fs.writeFile('./devices/dummy_devices.json', JSON.stringify(dummyData, null, 4), (err) => {
    if (err) return res.sendStatus(500).send({ error: 'Device status could not be updated' });

    res.json({ device: device.name, status: device.status });
  });
});

// Real Devices

app.get('/real/sensors/:name', async (req, res) => {
  const sensor = realData.sensors.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());

  if (!sensor) return res.status(404).send({error: 'Sensor not found'});

  const result = await fetch(sensor.endpoint, {method: "GET", headers: { 'Content-Type': 'application/json' }});
  const data = await result.json();
  res.json(data);
});

app.get('/real/devices/:name', async (req, res) => {
  const device = realData.devices.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());

  if (!device) return res.status(404).send({ error: 'Device not found' });

  const result = await fetch(device.endpoint, {method: "GET", headers: { 'Content-Type': 'application/json' }});
  const data = await result.json();
  res.json(data);
});

app.post('/real/devices/:name', async (req, res) => {
  if(!req.body) return res.status(400).send({ error: 'Missing request body' });

  const { action } = req.body;
  const device = realData.devices.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());

  if (!device) return res.status(404).send({ error: 'Device not found' });
  if(!action) return res.status(400).send({ error: 'Missing action field in body' });

  const result = await fetch(device.endpoint, {method: "POST", body: JSON.stringify({action: action}), headers: { 'Content-Type': 'application/json' }});
  const data = await result.json();
  res.json(data);
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
            const increment = Math.floor(Math.random() * 4) - 2;
            s.value = (parseFloat(s.value) + increment).toString();
          }
        }
      })
      dummyData.sensors = sensors;
      fs.writeFile('./devices/dummy_devices.json', JSON.stringify(dummyData, null, 4), () => {});
    })
}

setInterval(updateDummySensors, 3000);

app.listen(port, () => {
  console.log(`Devices API server running at http://localhost:${port}`);
});
