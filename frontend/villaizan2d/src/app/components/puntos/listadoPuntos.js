"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Pagination, ButtonGroup, Modal, Form } from "react-bootstrap";
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
    const [viewType, setViewType] = useState("activos"); // "activos", "inactivos", "todos"
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newPoints, setNewPoints] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showNuevoModal, setShowNuevoModal] = useState(false); // Estado para mostrar el modal de nueva puntos
    const itemsPerPage = 10;
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal de confirmación
    const [selectedDeleteId, setSelectedDeleteId] = useState(null); // ID del punto seleccionado para inactivar


    // Llamada a la API para listar todos los puntos
    useEffect(() => {
        const fetchPuntosYProductos = async () => {
            try {
                const puntosResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/puntos_producto/listarTodos`);
                const productosResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/productos/listarTodos`);

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
            if (viewType === "activos") return item.estaactivo === true;
            if (viewType === "inactivos") return item.estaactivo === false;
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
            await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/puntos_producto/editar`, {
                id_puntosproducto: selectedProduct.id_puntosproducto,
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

    const handleDelete = (id_puntosproducto) => {
        setSelectedDeleteId(id_puntosproducto); // Guardar el ID del punto a inactivar
        setShowConfirmModal(true); // Mostrar el modal de confirmación
    }
    ;

    const confirmDelete = async () => {
        try {
            if (!selectedDeleteId) return; // Validar que haya un ID seleccionado
    
            await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/puntos_producto/inactivar/${selectedDeleteId}`);
    
            // Actualizar la lista de puntos
            const updatedPuntos = puntos.map((item) =>
                item.id_puntosproducto === selectedDeleteId
                    ? { ...item, estaactivo: false } // Cambiar el estado a inactivo
                    : item
            );
            setPuntos(updatedPuntos);
    
            setShowConfirmModal(false); // Cerrar el modal
            setSelectedDeleteId(null); // Limpiar el ID seleccionado
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
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownStyle = {
        maxHeight: '200px',
        overflowY: 'auto',
        position: 'absolute',
        zIndex: 1000,
        width: '100%',
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
                <Form.Control
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true); // Mostrar el dropdown mientras se escribe
                    }}
                    onFocus={() => setShowDropdown(true)} // Mostrar al enfocar
                    />
                    {showDropdown && (
                        <ul className="list-group mt-2" style={dropdownStyle}>
                            {productos
                            .filter((producto) =>
                                producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((producto) => (
                                <li
                                key={producto.id}
                                className="list-group-item list-group-item-action"
                                onClick={() => {
                                    setid_producto(producto.id);
                                    setNombreProducto(producto.nombre);
                                    setSearchTerm(producto.nombre); // Mantener el producto seleccionado en el input
                                    setShowDropdown(false); // Ocultar el dropdown
                                }}
                                >
                                {producto.nombre}
                                </li>
                            ))}
                        </ul>
                        
                        )}

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
                        <th style={{ width: "23%", textAlign: "left" }}>Id Producto</th>
                        <th style={{ width: "18%", textAlign: "left" }}>Nombre Producto</th>
                        <th style={{ width: "10%", textAlign: "center" }}>Cantidad Puntos</th>
                        <th style={{ width: "15%", textAlign: "center" }}>Usuario Actualización</th>
                        <th style={{ width: "12%", textAlign: "center" }}>Fecha Actualización</th>
                        <th style={{ width: "12%", textAlign: "center" }}>Hora Actualización</th>
                        <th style={{ width: "10%", textAlign: "center" }}>Acciones</th> 
                        <th style={{ width: "10%", textAlign: "center" }}>Estado</th> 
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => {
                        const producto = productos.find(p => p.id === item.id_producto);
                        const { fechaFormateada, horaFormateada } = formatFechaHora(item.actualizadoen);
                        return (
                            <tr key={item.id_puntosproducto}>
                                <td style={{ textAlign: "left" }}> {producto ? producto.id : "Producto no encontrado"}</td>
                                <td style={{ textAlign: "left" }}>{producto ? producto.nombre : "Producto no encontrado"}</td>
                                <td style={{ textAlign: "center" }}>{item.cantidadpuntos}</td>
                                <td style={{ textAlign: "center" }}>admin</td>
                                <td style={{ textAlign: "center" }}>{fechaFormateada}</td>
                                <td style={{ textAlign: "center" }}>{horaFormateada}</td>
                                <td className="text-center">
                                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(item)}>
                                        <FaEdit /> 
                                    </Button>
                                </td>
                                <td className="text-center">
                                    <Button 
                                        variant={item.estaactivo ? "success" : "danger"} 
                                        size="sm" 
                                        onClick={() => handleDelete(item.id_puntosproducto)} 
                                    >
                                        {item.estaactivo ? "Activo" : "Inactivo"}
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

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Inactivación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas inactivar la asignación de puntos de este producto? Esta acción no se puede deshacer.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Inactivar
                    </Button>
                </Modal.Footer>
            </Modal>

            <NuevaPuntos show={showNuevoModal} handleClose={handleCloseNuevoModal} />
        </Container>
    );
}








