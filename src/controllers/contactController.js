const Contact = require('../models/Contact');

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.getAll();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar contatos', error: error.message });
  }
};

exports.createContact = async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar contato', error: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    await Contact.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: 'Erro ao excluir contato', error: error.message });
  }
};

exports.respondToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const responseData = req.body;
    
    const updatedContact = await Contact.respond(id, responseData);
    
    // Opcional: Enviar email real (você precisaria configurar um serviço de email)
    if (updatedContact.email) {
      // sendEmail(updatedContact.email, 'Resposta da Chapa Vermelha', responseData.response);
      console.log(`Email seria enviado para ${updatedContact.email}`);
    }
    
    res.status(200).json({ message: 'Resposta enviada com sucesso' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao responder contato', error: error.message });
  }
};

// Novo método para buscar contato pelo código de acompanhamento
exports.getByTrackingCode = async (req, res) => {
  try {
    const trackingCode = req.params.code;
    const contact = await Contact.getByTrackingCode(trackingCode);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar contato', error: error.message });
  }
};