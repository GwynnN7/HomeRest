const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const loadDevices = () => {
  const data = fs.readFileSync('devices/devices.json');
  return JSON.parse(data);
};

const devices = loadDevices();

app.get('/devices', (req, res) => {
  res.json(devices.devices);
});

app.get('/sensors', (req, res) => {
  res.json(devices.sensors);
});

app.get('/sensors/:name', (req, res) => {
  const sensor = devices.sensors.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());
  if (!sensor) return res.status(404).send({ error: 'Sensor not found' });
  res.json({ sensor: sensor.name, value: sensor.value, unit: sensor.unit });
});

app.get('/devices/:name', (req, res) => {
  const device = devices.devices.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());
  if (!device) return res.status(404).send({ error: 'Device not found' });
  res.json({ device: device.name, status: device.status });
});

app.post('/devices/:name', (req, res) => {
  const { action } = req.body;
  const device = devices.devices.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());
  if (!device) return res.status(404).send({ error: 'Device not found' });

  if (!device.actions.includes(action)) {
    return res.status(400).send({ error: 'Invalid action' });
  }

  if(action === "toggle") device.status = device.status === 'on' ? 'off' : 'on';
  else device.status = action;
  res.json({ device: device.name, status: device.status });
});

app.listen(port, () => {
  console.log(`Device API server running at http://localhost:${port}`);
});
