"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Pagination, ButtonGroup, Modal, Alert} from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; 
import axios from "axios"; 
import * as XLSX from "xlsx";
import NuevaRecompensa from './formularioRecompensas.js';

export default function ListadoRecompensas() {
    const router = useRouter();
    
    const [recompensas, setRecompensas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewType, setViewType] = useState("activos"); // "activos", "inactivos", "todos"
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecompensa, setSelectedRecompensa] = useState(null);
    const [newAmount, setNewAmount] = useState("");
    const [showEditModal, setShowEditModal] = useState(false); // Controla la visibilidad del modal de edición
    const itemsPerPage = 15;
    const [error, setError] = useState('');
    const [showNuevoModal, setShowNuevoModal] = useState(false); // Estado para mostrar el modal de nueva recompensa
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false); // Modal para confirmación de eliminación
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false); // Modal para confirmar que se eliminó correctamente

    // Función para cargar recompensas y productos desde el backend
    const fetchRecompensasYProductos = async () => {
        try {
            const recompensasResponse = await axios.get("http://localhost:3000/recompensa_puntos/listarTodos");
            const productosResponse = await axios.get("http://localhost:3000/productos/listarTodos");

            setRecompensas(recompensasResponse.data);
            setProductos(productosResponse.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };

    // Llamada a la API para listar todas las recompensas
    useEffect(() => {
        fetchRecompensasYProductos();
    }, []);

    // Filtrar recompensas según el estado seleccionado (Activos, Inactivos, Todos) y búsqueda por nombre de producto
    const filteredRecompensas = recompensas
        .filter((item) => {
            if (viewType === "activos") return item.estado === true;
            if (viewType === "inactivos") return item.estado === false;
            return true; // "todos" muestra todos los registros
        })
        .filter((item) => {
            const producto = productos.find(p => p.id === item.id_producto);
            return producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => new Date(b.actualizadoen) - new Date(a.actualizadoen)); // Ordenar de mayor a menor fecha de actualización

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRecompensas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRecompensas.length / itemsPerPage);

    // Formato de fecha y hora
    const formatFechaHora = (fechaString) => {
        const fecha = new Date(fechaString);
        const fechaFormateada = fecha.toLocaleDateString();
        const horaFormateada = fecha.toLocaleTimeString();
        return { fechaFormateada, horaFormateada };
    };

    const handleEdit = (recompensa) => {
        setSelectedRecompensa(recompensa);
        setNewAmount(recompensa.puntosnecesarios); // Establecer la cantidad actual como valor inicial
        setShowEditModal(true); // Mostrar el modal de edición
    };    

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setNewAmount("");
    };

    const handleSave = async () => {
        try {
            const newAmountValue = parseInt(newAmount);
            if (isNaN(newAmountValue)) {
                alert("Por favor ingrese una cantidad válida.");
                return;
            }

            const puntos = parseInt(newAmountValue);
            if (puntos < 10 || puntos > 90) {
            setError('El puntaje que se asignará debe de ser como mínimo 10 y como máximo 90.');
            return;
            }

            await axios.put("http://localhost:3000/recompensa_puntos/editar", {
                id_recompensa: selectedRecompensa.id_recompensa,
                id_producto: selectedRecompensa.id_producto,
                puntosNecesarios: newAmountValue
            });

            const updatedRecompensas = recompensas.map((item) => 
                item.id_recompensa === selectedRecompensa.id_recompensa
                ? { ...item, puntosNecesarios: newAmountValue }
                : item
            );
            setRecompensas(updatedRecompensas);

            handleCloseEditModal();
            setError('');
            fetchRecompensasYProductos(); 
        } catch (error) {
            console.error("Error al editar la recompensa:", error);
            alert("Error al guardar los cambios. Inténtalo de nuevo.");
        }
    };

    const handleDelete = (recompensa) => {
        setSelectedRecompensa(recompensa);
        setShowConfirmDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.put(`http://localhost:3000/recompensa_puntos/inactivar/${parseInt(selectedRecompensa.id_recompensa)}`);
            const updatedRecompensas = recompensas.map((item) =>
                item.id_recompensa === selectedRecompensa.id_recompensa
                ? { ...item, estado: false }
                : item
            );
            setRecompensas(updatedRecompensas);
            setShowConfirmDeleteModal(false);
            setShowDeleteSuccessModal(true);
        } catch (error) {
            console.error("Error al inactivar la recompensa:", error);
            alert("Error al inactivar la recompensa. Inténtalo de nuevo.");
        }
    };

    const handleExport = () => {
        const worksheetData = filteredRecompensas.map((item) => {
            const producto = productos.find(p => p.id === item.id_producto);
            const { fechaFormateada, horaFormateada } = formatFechaHora(item.actualizadoen);
            return {
                ID: item.id_recompensa,
                Producto: producto ? producto.nombre : "Producto no encontrado",
                Puntos: item.puntosnecesarios,
                Fecha: fechaFormateada,
                Hora: horaFormateada,
            };
        });
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Recompensas");
        XLSX.writeFile(workbook, "recompensas_export.xlsx");
    };

    return (
        <Container fluid style={{ marginLeft: "60px", maxWidth: "95%" }}>
            <Row className="mb-4">
                <Col>
                    <h4>Recompensas</h4>
                    <p className="text-muted">Administra las recompensas, productos asociados y cantidades.</p>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <ButtonGroup>
                        <Button
                            variant={viewType === "activos" ? "danger" : "outline-danger"}
                            onClick={() => setViewType("activos")}
                        >
                            Activos
                        </Button>
                        <Button
                            variant={viewType === "inactivos" ? "danger" : "outline-danger"}
                            onClick={() => setViewType("inactivos")}
                        >
                            Inactivos
                        </Button>
                        <Button
                            variant={viewType === "todos" ? "danger" : "outline-danger"}
                            onClick={() => setViewType("todos")}
                        >
                            Todos
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <InputGroup>
                        <FormControl
                            placeholder="Buscar por producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={8}></Col>
                <Col md={4} className="d-flex justify-content-end align-items-start">
                    <Button variant="danger" className="me-2" onClick={() => setShowNuevoModal(true)}>+ Agregar</Button>
                    <Button variant="outline-danger" onClick={handleExport}>Exportar</Button>
                </Col>
            </Row>

            <Table hover>
                <thead>
                    <tr>
                        {/*<th>Id Producto</th>*/}
                        <th>Nombre Producto</th>
                        <th>Cantidad Puntos</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th className="text-center">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => {
                        const producto = productos.find(p => p.id === item.id_producto);
                        const { fechaFormateada, horaFormateada } = formatFechaHora(item.actualizadoen);
                        return (
                            <tr key={item.id_recompensa}>
                                {/*<td>{producto ? producto.id : "Producto no encontrado"}</td>*/}
                                <td>{producto ? producto.nombre : "Producto no encontrado"}</td>
                                <td>{item.puntosnecesarios}</td>
                                <td>{fechaFormateada}</td>
                                <td>{horaFormateada}</td>
                                <td className="text-center">
                                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(item)}>
                                        <FaEdit /> 
                                    </Button>
                                    <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => handleDelete(item)}>
                                        <FaTrashAlt />
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            <Pagination>
                <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
            </Pagination>

            <NuevaRecompensa show={showNuevoModal} handleClose={() => setShowNuevoModal(false)} />

            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Recompensa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <p>Producto: {selectedRecompensa ? productos.find(p => p.id === selectedRecompensa.id_producto)?.nombre : "Cargando..."}</p>
                    <p>Valor anterior: <strong>{selectedRecompensa?.puntosnecesarios}</strong></p>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Nuevos Puntos"
                            value={newAmount}
                            onChange={(e) => setNewAmount(e.target.value)}
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>Cerrar</Button>
                    <Button variant="danger" onClick={handleSave}>Guardar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar esta recompensa?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={confirmDelete}>Eliminar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteSuccessModal} onHide={() => setShowDeleteSuccessModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Recompensa Eliminada</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    La recompensa ha sido eliminada exitosamente.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteSuccessModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
