import React, { useState } from 'react';
import { X } from 'lucide-react';
import './CreateMicroserviceModal.scss';

interface Template {
  id: string;
  name: string;
  type: string;
  description: string;
  defaultCode: string;
}

interface CreateMicroserviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMicroservice: (data: {
    name: string;
    type: string;
    description: string;
    code: string;
    template: string;
  }) => void;
}

const templates: Template[] = [
  {
    id: 'rest-api',
    name: 'REST API',
    type: 'REST API',
    description: 'API RESTful con Express.js',
    defaultCode: `const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// GET endpoint
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello World' });
});

// POST endpoint
app.post('/api/data', (req, res) => {
  const data = req.body;
  res.json({ received: data });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`,
  },
  {
    id: 'graphql',
    name: 'GraphQL API',
    type: 'GraphQL',
    description: 'Servidor GraphQL con Apollo',
    defaultCode: `const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql\`
  type Query {
    hello: String
    user(id: ID!): User
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }
\`;

const resolvers = {
  Query: {
    hello: () => 'Hello World',
    user: (_, { id }) => ({
      id,
      name: 'John Doe',
      email: 'john@example.com',
    }),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(\`Server ready at \${url}\`);
});`,
  },
  {
    id: 'websocket',
    name: 'WebSocket Server',
    type: 'WebSocket',
    description: 'Servidor WebSocket en tiempo real',
    defaultCode: `const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);

    // Echo message back to client
    ws.send(\`Echo: \${message}\`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Send welcome message
  ws.send('Welcome to WebSocket server');
});

console.log('WebSocket server running on port 8080');`,
  },
  {
    id: 'microservice',
    name: 'Microservicio Base',
    type: 'Microservice',
    description: 'Microservicio básico con procesamiento',
    defaultCode: `const processData = async (data) => {
  // Procesamiento de datos
  console.log('Processing:', data);

  return {
    status: 'success',
    processed: data,
    timestamp: new Date().toISOString(),
  };
};

const main = async () => {
  const result = await processData({ message: 'Hello' });
  console.log('Result:', result);
};

main();`,
  },
];

const CreateMicroserviceModal: React.FC<CreateMicroserviceModalProps> = ({
  isOpen,
  onClose,
  onCreateMicroservice,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState(templates[0].defaultCode);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setCode(template.defaultCode);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateMicroservice({
      name,
      type: selectedTemplate.type,
      description,
      code,
      template: selectedTemplate.id,
    });
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedTemplate(templates[0]);
    setCode(templates[0].defaultCode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="create-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-modal__header">
          <h2 className="create-modal__title">Crear Nuevo Microservicio</h2>
          <button className="create-modal__close" onClick={handleClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-modal__form">
          <div className="create-modal__section">
            <label className="create-modal__label">Nombre del Microservicio</label>
            <input
              type="text"
              className="create-modal__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="mi-microservicio"
              required
            />
          </div>

          <div className="create-modal__section">
            <label className="create-modal__label">Tipo/Plantilla</label>
            <select
              className="create-modal__select"
              value={selectedTemplate.id}
              onChange={(e) => handleTemplateChange(e.target.value)}
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} - {template.description}
                </option>
              ))}
            </select>
          </div>

          <div className="create-modal__section">
            <label className="create-modal__label">Descripción</label>
            <textarea
              className="create-modal__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del microservicio..."
              rows={3}
              required
            />
          </div>

          <div className="create-modal__section">
            <label className="create-modal__label">
              Código (Plantilla: {selectedTemplate.name})
            </label>
            <textarea
              className="create-modal__code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={15}
              spellCheck={false}
              required
            />
          </div>

          <div className="create-modal__actions">
            <button
              type="button"
              className="create-modal__btn create-modal__btn--cancel"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button type="submit" className="create-modal__btn create-modal__btn--submit">
              Crear Microservicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMicroserviceModal;
