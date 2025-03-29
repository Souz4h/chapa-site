const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

const DATABASE_PATH = path.join(__dirname, '../../database/contacts.json');

class Contact {
  static async getAll() {
    try {
      const data = await fs.readJson(DATABASE_PATH);
      return data.contacts || [];
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeJson(DATABASE_PATH, { contacts: [] });
        return [];
      }
      throw error;
    }
  }

  static async create(contactData) {
    const data = await fs.readJson(DATABASE_PATH);
    
    // Generate a tracking code (6 alphanumeric characters)
    const trackingCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    const newContact = {
      id: uuidv4(),
      ...contactData,
      trackingCode,
      status: 'pendente',
      createdAt: new Date().toISOString()
    };
  
    data.contacts.push(newContact);
    await fs.writeJson(DATABASE_PATH, data);
    return newContact;
  }

  static async delete(id) {
    const data = await fs.readJson(DATABASE_PATH);
    data.contacts = data.contacts.filter(contact => contact.id !== id);
    await fs.writeJson(DATABASE_PATH, data);
  }

  static async respond(contactId, responseData) {
    const data = await fs.readJson(DATABASE_PATH);
    const contactIndex = data.contacts.findIndex(contact => contact.id === contactId);
    
    if (contactIndex === -1) {
      throw new Error('Contato não encontrado');
    }
    
    // Inicializar o array de respostas se não existir
    if (!data.contacts[contactIndex].responses) {
      data.contacts[contactIndex].responses = [];
    }
    
    // Adicionar a nova resposta
    data.contacts[contactIndex].responses.push({
      text: responseData.response,
      respondedAt: new Date().toISOString()
    });
    
    // Atualizar o status
    data.contacts[contactIndex].status = 'respondido';
    
    await fs.writeJson(DATABASE_PATH, data);
    
    return data.contacts[contactIndex];
  }

  static async getByTrackingCode(trackingCode) {
    const contacts = await this.getAll();
    return contacts.find(contact => contact.trackingCode === trackingCode);
  }
}

module.exports = Contact;