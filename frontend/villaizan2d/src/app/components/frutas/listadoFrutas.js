"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Pagination, ButtonGroup, Modal } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; 
import axios from "axios"; 
import * as XLSX from "xlsx";

export default function ListadoFrutas() {
    const router = useRouter();

    const [frutas, setFrutas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewType, setViewType] = useState("activos"); // "todos", "activos" o "inactivos"
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFruta, setSelectedFruta] = useState(null);
    const [newDescription, setNewDescription] = useState("");
    const [showModal, setShowModal] = useState(false);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchFrutas = async () => {
            try {
                const frutasResponse = await axios.get("http://localhost:3000/fruta/listarTodos");
                setFrutas(frutasResponse.data);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchFrutas();
    }, []);

    // Filtrar frutas según el estado y la búsqueda
    const filteredFrutas = frutas
        .filter((item) => {
            if (viewType === "activos") return item.estaactivo === true;
            if (viewType === "inactivos") return item.estaactivo === false;
            return true; // "todos" muestra todos los registros
        })
        .filter((item) => item.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFrutas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredFrutas.length / itemsPerPage);

    const handleEdit = (fruta) => {
        setSelectedFruta(fruta);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setNewDescription("");
    };

    const handleSave = async () => {
        try {
            await axios.put("http://localhost:3000/fruta/editar", {
                idFruta: selectedFruta.id,
                nuevaDescripcion: newDescription,
            });

            const updatedFrutas = frutas.map((item) =>
                item.id === selectedFruta.id ? { ...item, descripcion: newDescription } : item
            );
            setFrutas(updatedFrutas);

            handleClose();
        } catch (error) {
            console.error("Error al editar la fruta:", error);
            alert("Error al guardar los cambios. Inténtalo de nuevo.");
        }
    };

    const handleDelete = async (idFruta) => {
        try {
            await axios.put(`http://localhost:3000/fruta/inactivar/${idFruta}`);
            const updatedFrutas = frutas.map((item) =>
                item.id === idFruta ? { ...item, estado: false } : item
            );
            setFrutas(updatedFrutas);
        } catch (error) {
            console.error("Error al inactivar la fruta:", error);
            alert("Error al inactivar la fruta. Inténtalo de nuevo.");
        }
    };

    const handleExport = () => {
        const worksheetData = filteredFrutas.map((item) => {
            const productosRelacionados = item.vi_producto_fruta && Array.isArray(item.vi_producto_fruta) && item.vi_producto_fruta.length > 0
            ? item.vi_producto_fruta.map(p => p.vi_producto ? p.vi_producto.nombre : "Producto sin nombre").join(", ")
            : "No tiene productos";
            return {
                Nombre: item.nombre,
                Descripción: item.descripcion,
                Productos: productosRelacionados,
            };
        });
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Frutas");
        XLSX.writeFile(workbook, "frutas_export.xlsx");
    };

    return (
        <Container fluid style={{ marginLeft: "60px", maxWidth: "95%" }}>
            <Row className="mb-4">
                <Col>
                    <h4>Frutas</h4>
                    <p className="text-muted">Administra las frutas, sus descripciones y productos relacionados.</p>
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

            <Row className="mb-4" style={{ position: 'relative', zIndex: 1 }}>
                <Col>
                    <InputGroup>
                        <FormControl
                            placeholder="Buscar por nombre de fruta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={8}></Col>
                <Col md={4} className="d-flex justify-content-end align-items-start">
                    <Button variant="danger" className="me-2" onClick={() => router.push("/pages/frutas/nuevo")}>+ Agregar</Button>
                    <Button variant="outline-danger" onClick={handleExport}>Exportar</Button>
                </Col>
            </Row>

            <Table hover>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Productos</th>
                        <th className="text-center">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                {currentItems.map((item) => {
                    console.log("Fruta completa:", item); // Verifica la estructura completa de item

                    const productosRelacionados = item.vi_producto_fruta && Array.isArray(item.vi_producto_fruta) && item.vi_producto_fruta.length > 0
                    ? item.vi_producto_fruta.map(p => p.vi_producto ? p.vi_producto.nombre : "Producto sin nombre").join(", ")
                    : "No tiene productos";
            
                    return (
                        <tr key={item.id}>
                            <td>{item.nombre}</td>
                            <td>{item.descripcion}</td>
                            <td>{productosRelacionados}</td>
                            <td className="text-center">
                                <Button variant="outline-primary" size="sm" onClick={() => router.push(`/pages/frutas/editar?id=${item.id}`)}>
                                    <FaEdit />
                                </Button>
                                <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => handleDelete(item.id)}>
                                    <FaTrashAlt />
                                </Button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>

            </Table>

            <Pagination style={{ position: 'relative', zIndex: 1 }}>
                <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
            </Pagination>

            
        </Container>
    );
}


