const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');

const DATABASE_PATH = path.join(__dirname, '../../database/events.json');

class Event {
  static async getAll() {
    try {
      const data = await fs.readJson(DATABASE_PATH);
      return data.events || [];
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeJson(DATABASE_PATH, { events: [] });
        return [];
      }
      throw error;
    }
  }

  static async create(eventData) {
    const data = await fs.readJson(DATABASE_PATH);
    const newEvent = {
      id: uuidv4(),
      ...eventData,
      createdAt: new Date().toISOString()
    };

    data.events.push(newEvent);
    await fs.writeJson(DATABASE_PATH, data);
    return newEvent;
  }

  static async update(id, updateData) {
    const data = await fs.readJson(DATABASE_PATH);
    const eventIndex = data.events.findIndex(event => event.id === id);

    if (eventIndex === -1) throw new Error('Evento não encontrado');

    data.events[eventIndex] = { 
      ...data.events[eventIndex], 
      ...updateData 
    };

    await fs.writeJson(DATABASE_PATH, data);
    return data.events[eventIndex];
  }

  static async delete(id) {
    const data = await fs.readJson(DATABASE_PATH);
    data.events = data.events.filter(event => event.id !== id);
    await fs.writeJson(DATABASE_PATH, data);
  }
}

module.exports = Event;