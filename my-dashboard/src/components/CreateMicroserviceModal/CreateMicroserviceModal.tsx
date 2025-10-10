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

// 🔹 NUEVAS PLANTILLAS PYTHON
const templates: Template[] = [
  {
    id: 'simple',
    name: 'Plantilla Simple',
    type: 'Python',
    description: 'Un microservicio mínimo que responde con un saludo.',
    defaultCode: `def microservicio(request_json):
    body = request_json.get("body", {})
    nombre = body.get("nombre", "Mundo")
    return {"mensaje": f"Hola {nombre}"}`,
  },
  {
    id: 'calculadora',
    name: 'Calculadora',
    type: 'Python',
    description: 'Microservicio que realiza operaciones matemáticas básicas.',
    defaultCode: `# app.py

from typing import Any, Dict

OPS_PERMITIDAS = {"sum", "sub", "mul", "div"}


def _to_float(value: Any, name: str) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        raise ValueError(f"El parámetro '{name}' debe ser numérico.")


def microservicio(request_json: Dict[str, Any]) -> Dict[str, Any]:
    try:
        body = (request_json or {}).get("body", {}) or {}

        op = str(body.get("op", "")).strip().lower()
        if op not in OPS_PERMITIDAS:
            return {
                "ok": False,
                "error": "Operación inválida. Usa: sum | sub | mul | div"
            }

        a = _to_float(body.get("a", None), "a")
        b = _to_float(body.get("b", None), "b")

        if op == "sum":
            result = a + b
        elif op == "sub":
            result = a - b
        elif op == "mul":
            result = a * b
        elif op == "div":
            if b == 0:
                return {"ok": False, "error": "División por cero no permitida."}
            result = a / b

        return {
            "ok": True,
            "op": op,
            "a": a,
            "b": b,
            "result": result
        }

    except ValueError as e:
        return {"ok": False, "error": str(e)}
    except Exception as e:
        return {"ok": False, "error": f"Error inesperado: {e}"}`,
  },
  {
    id: 'tabla-roble',
    name: 'Tabla Roble',
    type: 'Python',
    description:
      'Conecta con el servicio Roble para leer una tabla y contar nombres distintos.',
    defaultCode: `# app.py
# Microservicio: obtiene todos los datos de la columna "nombre" de una tabla
# y cuenta cuántos nombres distintos hay, usando el servicio de base de datos Uninorte.

import requests
from typing import Any, Dict, List

BASE_URL = "https://roble-api.openlab.uninorte.edu.co/database"


def _err(msg: str) -> Dict[str, Any]:
    return {"ok": False, "error": msg}


def _ok(data: Dict[str, Any]) -> Dict[str, Any]:
    return {"ok": True, **data}


def microservicio(request_json: Dict[str, Any]) -> Dict[str, Any]:
    """
    Espera en el body:
    {
      "dbName": "token_project_xyz",
      "tableName": "usuarios",
      "access_token": "TU_ACCESS_TOKEN"
    }
    """
    try:
        body = (request_json or {}).get("body", {}) or {}
        db_name = body.get("dbName")
        table_name = body.get("tableName")
        token = body.get("access_token")

        if not db_name or not table_name or not token:
            return _err("Faltan parámetros: dbName, tableName o access_token")

        # Construir URL completa
        url = f"{BASE_URL}/{db_name}/read"
        params = {"tableName": table_name}
        headers = {"Authorization": f"Bearer {token}"}

        resp = requests.get(url, headers=headers, params=params, timeout=30)
        if resp.status_code != 200:
            try:
                msg = resp.json()
            except Exception:
                msg = resp.text
            return _err(f"Error del servicio ({resp.status_code}): {msg}")

        data = resp.json()
        if not isinstance(data, list):
            return _err("Respuesta inesperada: se esperaba una lista de registros")

        nombres: List[str] = []
        for fila in data:
            if not isinstance(fila, dict):
                continue
            valor = fila.get("nombre")
            if valor is None:
                continue
            s = str(valor).strip()
            if s:
                nombres.append(s)

        total = len(nombres)
        distintos = len(set(nombres))

        return _ok({
            "column": "nombre",
            "names": nombres,
            "total": total,
            "distinct_count": distintos
        })

    except requests.Timeout:
        return _err("Timeout al consultar el servicio.")
    except requests.RequestException as e:
        return _err(f"Error de red: {e}")
    except Exception as e:
        return _err(f"Error inesperado: {e}")`,
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
              onChange={(e) => setName(e.target.value.toLowerCase())}
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
