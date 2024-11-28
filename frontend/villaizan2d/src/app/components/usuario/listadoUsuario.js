"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Pagination, Modal, Alert } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import * as XLSX from "xlsx";

export default function ListadoUsuarios() {
    const router = useRouter();

    const [usuarios, setUsuarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewType, setViewType] = useState("activos"); // "activos", "inactivos", "todos"
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [error, setError] = useState("");
    const [editedUsuario, setEditedUsuario] = useState({});
    const itemsPerPage = 10;

    // Cargar usuarios desde el backend
    const fetchUsuarios = async () => {
        try {
            const response = await axios.get("http://localhost:3000/usuarios/listarTodos");
            setUsuarios(response.data);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    // Filtrar usuarios por estado y búsqueda
    const filteredUsuarios = usuarios
        .filter((usuario) => {
            if (viewType === "activos") return usuario.estaactivo === true;
            if (viewType === "inactivos") return usuario.estaactivo === false;
            return true; // Mostrar todos
        })
        .filter((usuario) =>
            (usuario.nombre + " " + usuario.apellido)
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

    const handleEdit = (usuario) => {
        setSelectedUsuario(usuario);
        setEditedUsuario(usuario);
        setShowEditModal(true);
    };

    const handleSave = async () => {
        try {
            await axios.put("http://localhost:3000/usuarios/editar", editedUsuario);
            fetchUsuarios();
            setShowEditModal(false);
        } catch (error) {
            console.error("Error al editar el usuario:", error);
            setError("Ocurrió un error al guardar los cambios.");
        }
    };

    const handleDelete = (usuario) => {
        setSelectedUsuario(usuario);
        setShowConfirmDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.put(`http://localhost:3000/usuarios/activarInactivar/${selectedUsuario.id_usuario}`, {
                estaactivo: !selectedUsuario.estaactivo,
            });
            fetchUsuarios();
            setShowConfirmDeleteModal(false);
        } catch (error) {
            console.error("Error al cambiar el estado del usuario:", error);
        }
    };

    const handleExport = () => {
        const worksheetData = filteredUsuarios.map((usuario) => ({
            ID: usuario.id_usuario,
            Nombre: usuario.nombre,
            Apellido: usuario.apellido,
            Correo: usuario.correo,
            Estado: usuario.estaactivo ? "Activo" : "Inactivo",
        }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
        XLSX.writeFile(workbook, "usuarios_export.xlsx");
    };

    const handleAddNew = () => {
        router.push("/pages/usuario/nuevo");
    };

    return (
        <Container fluid style={{ marginLeft: "60px", maxWidth: "95%" }}>
            <Row className="mb-4">
                <Col>
                    <h4>Usuarios</h4>
                    <p className="text-muted">Administra los usuarios, sus datos y su estado activo/inactivo.</p>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <InputGroup>
                        <FormControl
                            placeholder="Buscar por nombre o apellido..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={4} className="d-flex justify-content-end align-items-start">
                    <Button variant="danger" className="me-2" onClick={handleAddNew}>+ Agregar</Button>
                    <Button variant="outline-danger" onClick={handleExport}>
                        Exportar
                    </Button>
                </Col>
            </Row>

            <Table hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((usuario) => (
                        <tr key={usuario.id_usuario}>
                            <td>{usuario.id_usuario}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.apellido}</td>
                            <td>{usuario.correo}</td>
                            <td>{usuario.rol}</td>
                            <td>{usuario.estaactivo ? "Activo" : "Inactivo"}</td>
                            <td>
                                <Button
                                    variant={usuario.estaactivo ? "danger" : "success"}
                                    size="sm"
                                    onClick={() => handleDelete(usuario)}
                                >
                                    {usuario.estaactivo ? "Inactivar" : "Activar"}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination>
                <Pagination.Prev
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                        key={index}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                />
            </Pagination>

            {/* Modal de edición */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Nombre"
                            value={editedUsuario.nombre || ""}
                            onChange={(e) =>
                                setEditedUsuario({ ...editedUsuario, nombre: e.target.value })
                            }
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Apellido"
                            value={editedUsuario.apellido || ""}
                            onChange={(e) =>
                                setEditedUsuario({ ...editedUsuario, apellido: e.target.value })
                            }
                        />
                    </InputGroup>
                    <InputGroup>
                        <FormControl
                            placeholder="Correo"
                            value={editedUsuario.correo || ""}
                            onChange={(e) =>
                                setEditedUsuario({ ...editedUsuario, correo: e.target.value })
                            }
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant="danger" onClick={handleSave}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de confirmación */}
            <Modal
                show={showConfirmDeleteModal}
                onHide={() => setShowConfirmDeleteModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Cambiar Estado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas cambiar el estado de este usuario?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowConfirmDeleteModal(false)}
                    >
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
