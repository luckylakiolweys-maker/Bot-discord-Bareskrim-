const fs = require('fs');
const path = require('path');

const POINTS_FILE = path.join(__dirname, '../points.json');
const ADMIN_ROLE_ID = '1547367417481789531';

function loadPoints() {
  try {
    if (fs.existsSync(POINTS_FILE)) {
      return JSON.parse(fs.readFileSync(POINTS_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading points:', error);
  }
  return {};
}

function savePoints(data) {
  try {
    fs.writeFileSync(POINTS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving points:', error);
    return false;
  }
}

function addPoints(userId, amount) {
  const points = loadPoints();
  points[userId] = (points[userId] || 0) + amount;
  savePoints(points);
  return points[userId];
}

function removePoints(userId, amount) {
  const points = loadPoints();
  if (amount === 0) {
    points[userId] = 0;
  } else {
    points[userId] = Math.max((points[userId] || 0) - amount, 0);
  }
  savePoints(points);
  return points[userId];
}

function getPoints(userId) {
  const points = loadPoints();
  return points[userId] || 0;
}

function getTopPoints(limit = 10) {
  const points = loadPoints();
  return Object.entries(points)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function isAdmin(member) {
  return member.roles.cache.has(ADMIN_ROLE_ID);
}

module.exports = {
  loadPoints,
  savePoints,
  addPoints,
  removePoints,
  getPoints,
  getTopPoints,
  isAdmin,
  ADMIN_ROLE_ID,
};
