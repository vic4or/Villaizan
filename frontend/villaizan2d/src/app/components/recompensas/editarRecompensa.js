import React, { useState, useEffect } from 'react';
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';

const EditarRecompensa = ({ show, handleClose, recompensa, productos, onSave }) => {
  const [newPoints, setNewPoints] = useState(recompensa ? recompensa.puntosnecesarios : '');

  useEffect(() => {
    if (recompensa) {
      setNewPoints(recompensa.puntosnecesarios);
    }
  }, [recompensa]);

  const handleSave = async () => {
    try {
      const nuevaCantidad = parseInt(newPoints);
      if (isNaN(nuevaCantidad)) {
        alert("Por favor ingrese una cantidad válida.");
        return;
      }

      await axios.put("http://localhost:3000/recompensa_puntos/editar", {
        id_recompensa: recompensa.id_recompensa,
        nuevaCantidad: nuevaCantidad
      });

      onSave(recompensa.id_recompensa, nuevaCantidad);
      handleClose();
    } catch (error) {
      console.error("Error al editar la recompensa:", error);
      alert("Error al guardar los cambios. Inténtalo de nuevo.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Recompensa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Producto: {productos.find(p => p.id === recompensa?.id_producto)?.nombre || "Cargando..."}</p>
        <p>Valor anterior: <strong>{recompensa?.puntosnecesarios}</strong></p>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Nuevos Puntos"
            value={newPoints}
            onChange={(e) => setNewPoints(e.target.value)}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        <Button variant="danger" onClick={handleSave}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditarRecompensa;
