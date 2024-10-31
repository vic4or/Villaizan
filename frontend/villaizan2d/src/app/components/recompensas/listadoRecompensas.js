"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Pagination, ButtonGroup, Modal } from "react-bootstrap";
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
    const [viewType, setViewType] = useState("todos"); // "activos", "inactivos", "todos"
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecompensa, setSelectedRecompensa] = useState(null);
    const [newAmount, setNewAmount] = useState("");
    const [showModal, setShowModal] = useState(false);
    const itemsPerPage = 5;
    const [showNuevoModal, setShowNuevoModal] = useState(false); // Estado para mostrar el modal de nueva recompensa


    // Llamada a la API para listar todas las recompensas
    useEffect(() => {
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
        .sort((a, b) => new Date(b.fechaActivo) - new Date(a.fechaActivo));

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
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setNewAmount("");
    };

    // Función para abrir y cerrar el modal de Nueva Recompensa
    const handleShowNuevoModal = () => setShowNuevoModal(true);
    const handleCloseNuevoModal = () => setShowNuevoModal(false);

    const handleSave = async () => {
        try {
            const newAmountValue = parseInt(newAmount);
            if (isNaN(newAmountValue)) {
                alert("Por favor ingrese una cantidad válida.");
                return;
            }

            await axios.put("http://localhost:3000/recompensa_puntos/editar", {
                idRecompensa: selectedRecompensa.id_recompensa,
                idProducto: selectedRecompensa.id_producto,
                nuevaCantidad: newAmountValue
            });

            const updatedRecompensas = recompensas.map((item) => 
                item.id_recompensa === selectedRecompensa.id_recompensa
                ? { ...item, cantidad: newAmountValue }
                : item
            );
            setRecompensas(updatedRecompensas);

            handleClose();
        } catch (error) {
            console.error("Error al editar la recompensa:", error);
            alert("Error al guardar los cambios. Inténtalo de nuevo.");
        }
    };

    const handleDelete = async (idRecompensa) => {
        try {
            await axios.put(`http://localhost:3000/recompensa_puntos/inactivar/${idRecompensa}`);
            const updatedRecompensas = recompensas.map((item) =>
                item.id_recompensa === idRecompensa
                ? { ...item, estado: false }
                : item
            );
            setRecompensas(updatedRecompensas);
        } catch (error) {
            console.error("Error al inactivar la recompensa:", error);
            alert("Error al inactivar la recompensa. Inténtalo de nuevo.");
        }
    };

    const handleExport = () => {
        const worksheetData = filteredRecompensas.map((item) => {
            const producto = productos.find(p => p.id === item.id_producto);
            const { fechaFormateada, horaFormateada } = formatFechaHora(item.fechaActivo);
            return {
                ID: item.id_recompensa,
                Producto: producto ? producto.nombre : "Producto no encontrado",
                Cantidad: item.cantidad,
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
                <Button variant="danger" className="me-2" onClick={handleShowNuevoModal}>+ Agregar</Button>
                <Button variant="outline-danger" onClick={handleExport}>Exportar</Button>
                </Col>
            </Row>

            <Table hover>
                <thead>
                    <tr>
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
                        const { fechaFormateada, horaFormateada } = formatFechaHora(item.fechaActivo);
                        return (
                            <tr key={item.id_recompensa}>
                                <td>{producto ? producto.nombre : "Producto no encontrado"}</td>
                                <td>{item.cantidad}</td>
                                <td>{fechaFormateada}</td>
                                <td>{horaFormateada}</td>
                                <td className="text-center">
                                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(item)}>
                                        <FaEdit /> 
                                    </Button>
                                    <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => handleDelete(item.id_recompensa)}>
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

            <NuevaRecompensa show={showNuevoModal} handleClose={handleCloseNuevoModal} />
        </Container>
    );
}
