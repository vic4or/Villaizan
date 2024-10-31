"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Pagination, ButtonGroup, Modal } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; 
import axios from "axios"; 
import * as XLSX from "xlsx"; // Asegúrate de importar XLSX
import NuevaPuntos from './nuevaPuntos.js';

export default function ListadoPuntos() {
    const router = useRouter();
    
    const [puntos, setPuntos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewType, setViewType] = useState("todos"); // "activos", "inactivos", "todos"
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newPoints, setNewPoints] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showNuevoModal, setShowNuevoModal] = useState(false); // Estado para mostrar el modal de nueva puntos
    const itemsPerPage = 10;

    // Llamada a la API para listar todos los puntos
    useEffect(() => {
        const fetchPuntosYProductos = async () => {
            try {
                const puntosResponse = await axios.get("http://localhost:3000/puntos_producto/listarTodos");
                const productosResponse = await axios.get("http://localhost:3000/productos/listarTodos");

                setPuntos(puntosResponse.data); // Asumimos que la respuesta es el array de puntos
                setProductos(productosResponse.data); // Lista de productos
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchPuntosYProductos();
    }, []); // Ejecuta la petición solo al montar el componente

    // Filtrar puntos según el estado seleccionado (Activo/Inactivo) y búsqueda por nombre de producto
    const filteredPuntos = puntos
        .filter((item) => {
            if (viewType === "activos") return item.estado === true;
            if (viewType === "inactivos") return item.estado === false;
            return true; // "todos" muestra todos los registros
        }) // Filtrar por estado (true = activo, false = inactivo)
        .filter((item) => {
            const producto = productos.find(p => p.id === item.id_producto);
            return producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
        })
        // Ordenar los puntos por fecha y hora de forma descendente
        .sort((a, b) => new Date(b.fechaactivo) - new Date(a.fechaactivo)); // Cambiar a orden descendente

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPuntos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPuntos.length / itemsPerPage);

    // Formato de fecha y hora
    const formatFechaHora = (fechaString) => {
        const fecha = new Date(fechaString);
        const fechaFormateada = fecha.toLocaleDateString(); // Formato de fecha (dd/mm/yyyy)
        const horaFormateada = fecha.toLocaleTimeString();  // Formato de hora (hh:mm:ss)
        return { fechaFormateada, horaFormateada };
    };

    const handleEdit = (product) => {
        setSelectedProduct(product); // Guardar el producto seleccionado
        setShowModal(true); // Mostrar el modal
    };    

    const handleClose = () => {
        setShowModal(false); // Cerrar el modal
        setNewPoints(""); // Limpiar el valor de los puntos nuevos
    };


    // Función para abrir y cerrar el modal de Nueva puntos
    const handleShowNuevoModal = () => setShowNuevoModal(true);
    const handleCloseNuevoModal = () => setShowNuevoModal(false);

    const handleSave = async () => {
        try {
            // Verificamos que newPoints sea un número válido
            const nuevaCantidad = parseInt(newPoints);
            if (isNaN(nuevaCantidad)) {
                alert("Por favor ingrese una cantidad válida.");
                return;
            }

            // Hacemos la llamada a la API para editar
            await axios.put("http://localhost:3000/puntos_producto/editar", {
                idPuntosProducto: selectedProduct.id_puntosproducto,
                idProducto: selectedProduct.id_producto,
                nuevaCantidad: nuevaCantidad
            });

            // Actualizar la lista de puntos para reflejar los cambios
            const updatedPuntos = puntos.map((item) => 
                item.id_puntosproducto === selectedProduct.id_puntosproducto
                ? { ...item, cantidadpuntos: nuevaCantidad } // Actualiza la cantidad de puntos
                : item
            );
            setPuntos(updatedPuntos);

            handleClose(); // Cerrar el modal
        } catch (error) {
            console.error("Error al editar el punto:", error);
            alert("Error al guardar los cambios. Inténtalo de nuevo.");
        }
    };

    // Manejar la eliminación (inactivación) de un punto
    const handleDelete = async (idPuntosProducto) => {
        console.log("ID a inactivar:", idPuntosProducto); // Verificar el ID en la consola
        try {
            await axios.put(`http://localhost:3000/puntos_producto/inactivar/${idPuntosProducto}`);
            // Actualizar la lista de puntos para reflejar el cambio de estado
            const updatedPuntos = puntos.map((item) =>
                item.id_puntosproducto === idPuntosProducto
                ? { ...item, estado: false } // Cambiar el estado a inactivo
                : item
            );
            setPuntos(updatedPuntos);
        } catch (error) {
            console.error("Error al inactivar el punto:", error);
            alert("Error al inactivar el punto. Inténtalo de nuevo.");
        }
    };

    const handleExport = () => {
        const worksheetData = filteredPuntos.map((item) => {
            const producto = productos.find(p => p.id === item.id_producto);
            const { fechaFormateada, horaFormateada } = formatFechaHora(item.fechaactivo);
            return {
                ID: item.id_puntosproducto,
                Producto: producto ? producto.nombre : "Producto no encontrado",
                Puntos: item.cantidadpuntos,
                Fecha: fechaFormateada,
                Hora: horaFormateada,
                // Estado se eliminó
            };
        });
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Puntos");
        XLSX.writeFile(workbook, "puntos_export.xlsx");
    };      

    return (
        <Container fluid style={{ marginLeft: "60px", maxWidth: "95%" }}>
            <Row className="mb-4">
                <Col>
                    <h4>Puntos</h4>
                    <p className="text-muted">Administra los puntos conformado por los productos, descripción y puntos.</p>
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
                        <th>Puntos</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th className="text-center">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => {
                        const producto = productos.find(p => p.id === item.id_producto);
                        const { fechaFormateada, horaFormateada } = formatFechaHora(item.fechaactivo);
                        return (
                            <tr key={item.id_puntosproducto}>
                                <td>{producto ? producto.nombre : "Producto no encontrado"}</td>
                                <td>{item.cantidadpuntos}</td>
                                <td>{fechaFormateada}</td>
                                <td>{horaFormateada}</td>
                                <td className="text-center">
                                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(item)}>
                                        <FaEdit /> 
                                    </Button>
                                    <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => handleDelete(item.id_puntosproducto)}>
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

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Puntos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Producto: {selectedProduct ? productos.find(p => p.id === selectedProduct.id_producto)?.nombre : "Cargando..."}</p>
                    {/* Mostrar valor anterior */}
                    <p>Valor anterior: <strong>{selectedProduct?.cantidadpuntos}</strong></p>
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

            <NuevaPuntos show={showNuevoModal} handleClose={handleCloseNuevoModal} />
        </Container>
    );
}








