const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const loadDevices = function (type) {
  return JSON.parse(fs.readFileSync(`devices/${type}_devices.json`));
}

const writeDevices = () => {
  fs.writeFileSync('devices/fake_devices.json', JSON.stringify(devices, null, 4));
}

let devices = {}
let realRedirect = loadDevices("real");

app.use('/fake', (req, res, next) => {
  try {
    devices = loadDevices("fake");
    next();
  } catch (err) {
    res.sendStatus(500);
  }
});

app.get('/fake/sensors/:name', (req, res) => {
  const sensor = devices.sensors.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());
  if (!sensor) return res.status(404).send({ error: 'Sensor not found' });
  res.json({ sensor: sensor.name, value: sensor.value, unit: sensor.unit });
});

app.get('/fake/devices/:name', (req, res) => {
  const device = devices.devices.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());
  if (!device) return res.status(404).send({ error: 'Device not found' });
  res.json({ device: device.name, status: device.status });
});

app.post('/fake/devices/:name', (req, res) => {
  const { action } = req.body;
  const device = devices.devices.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());
  if (!device) return res.status(404).send({ error: 'Device not found' });

  if (!device.actions.includes(action)) {
    return res.status(400).send({ error: 'Invalid action' });
  }

  if(action === "toggle") device.status = device.status === 'on' ? 'off' : 'on';
  else device.status = action;
  res.json({ device: device.name, status: device.status });
  writeDevices()
});

app.get('/real/sensors/:name', async (req, res) => {
  const sensor = realRedirect.sensors.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());
  if (!sensor) return res.status(404).send({error: 'Sensor not found'});
  const result = await fetch(sensor.endpoint, {method: "GET", headers: { 'Content-Type': 'application/json' }});
  const data = await result.json();
  res.json(data);
});

app.get('/real/devices/:name', async (req, res) => {
  const device = realRedirect.devices.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());
  if (!device) return res.status(404).send({ error: 'Device not found' });
  const result = await fetch(device.endpoint, {method: "GET", headers: { 'Content-Type': 'application/json' }});
  const data = await result.json();
  res.json(data);
});

app.post('/real/devices/:name', async (req, res) => {
  const { action } = req.body;
  const device = realRedirect.devices.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());
  if (!device) return res.status(404).send({ error: 'Device not found' });
  const result = await fetch(device.endpoint, {method: "POST", body: JSON.stringify({action: action}), headers: { 'Content-Type': 'application/json' }});
  const data = await result.json();
  res.json(data);
});

app.listen(port, () => {
  console.log(`Device API server running at http://localhost:${port}`);
});
