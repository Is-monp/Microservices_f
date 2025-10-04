import React, { useState, useEffect } from 'react';
import { X, Save, Code } from 'lucide-react';
import './EditCodeModal.scss';

interface EditCodeModalProps {
  isOpen: boolean;
  microserviceName: string;
  currentCode: string;
  onClose: () => void;
  onSave: (code: string) => void;
}

const EditCodeModal: React.FC<EditCodeModalProps> = ({
  isOpen,
  microserviceName,
  currentCode,
  onClose,
  onSave,
}) => {
  const [code, setCode] = useState(currentCode);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setCode(currentCode);
    setHasChanges(false);
  }, [currentCode, isOpen]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setHasChanges(newCode !== currentCode);
  };

  const handleSave = () => {
    onSave(code);
    setHasChanges(false);
    onClose();
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirm = window.confirm('Tienes cambios sin guardar. ¿Deseas salir sin guardar?');
      if (!confirm) return;
    }
    setCode(currentCode);
    setHasChanges(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="edit-code-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-code-modal__header">
          <div className="edit-code-modal__title-section">
            <Code className="edit-code-modal__icon" />
            <div>
              <h2 className="edit-code-modal__title">Editar Código</h2>
              <p className="edit-code-modal__subtitle">{microserviceName}</p>
            </div>
          </div>
          <button className="edit-code-modal__close" onClick={handleClose}>
            <X />
          </button>
        </div>

        <div className="edit-code-modal__body">
          <div className="edit-code-modal__editor">
            <div className="edit-code-modal__editor-header">
              <span className="edit-code-modal__file-name">{microserviceName}.js</span>
              {hasChanges && <span className="edit-code-modal__unsaved">● Sin guardar</span>}
            </div>
            <textarea
              className="edit-code-modal__textarea"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>

        <div className="edit-code-modal__footer">
          <button
            className="edit-code-modal__btn edit-code-modal__btn--cancel"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            className="edit-code-modal__btn edit-code-modal__btn--save"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save className="edit-code-modal__btn-icon" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCodeModal;
