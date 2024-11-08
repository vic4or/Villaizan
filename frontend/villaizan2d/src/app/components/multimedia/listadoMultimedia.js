import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Pagination, ButtonGroup, Form } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as XLSX from "xlsx";
import axios from "axios";

export default function ListadoMultimedia() {
    const router = useRouter();
    const [multimedia, setMultimedia] = useState([]);
    const [frutas, setFrutas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewType, setViewType] = useState("activos"); // "activos", "inactivos", "todos"
    const [filterType, setFilterType] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 5;

    useEffect(() => {
        // Cargar multimedia desde la API
        axios.get("http://localhost:3000/contenidoeducativo/listarTodos")
            .then((response) => {
                setMultimedia(response.data);
            })
            .catch((error) => {
                console.error("Error al cargar los datos de multimedia:", error);
            });

        // Cargar frutas desde la API
        axios.get("http://localhost:3000/fruta/listarTodos")
            .then((response) => {
                setFrutas(response.data);
            })
            .catch((error) => {
                console.error("Error al cargar los datos de frutas:", error);
            });
    }, []);

    // Obtener el nombre de la fruta por el ID
    const getNombreFruta = (id_fruta) => {
        const fruta = frutas.find((f) => f.id === id_fruta);
        return fruta ? fruta.nombre : "Desconocido";
    };

    // Filtrado de multimedia según el estado, tipo, y palabras clave
    const filteredMultimedia = multimedia
        .filter((item) => {
            if (viewType === "activos") return item.estaactivo === true;
            if (viewType === "inactivos") return item.estaactivo === false;
            return true; // "todos" muestra todos los registros
        })
        .filter((item) => (filterType ? item.tipocontenido === filterType : true))
        .filter((item) => item.titulo.toLowerCase().includes(searchTerm.toLowerCase()));

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMultimedia.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMultimedia.length / itemsPerPage);

    const handleEdit = (id) => {
        router.push(`/pages/multimedia/editar/?id=${id}`);
    };

    const handleAddNew = () => {
        router.push("/pages/multimedia/nuevo");
    };

    // Función para inactivar multimedia
    const handleDelete = (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas inactivar este contenido?");
        if (confirmDelete) {
            axios.put(`http://localhost:3000/contenidoeducativo/inactivar/${id}`)
                .then((response) => {
                    console.log("Contenido inactivado exitosamente:", response.data);
                    // Actualizar la lista de multimedia
                    setMultimedia(prevMultimedia => 
                        prevMultimedia.map(item => 
                            item.id === id ? { ...item, estaactivo: false } : item
                        )
                    );
                })
                .catch((error) => {
                    console.error("Error al inactivar el contenido:", error);
                    alert("Hubo un error al inactivar el contenido");
                });
        }
    };

    // Función para exportar datos a CSV
    const handleExport = () => {
        const worksheetData = filteredMultimedia.map((item) => ({
            ID: item.id,
            Fruta: getNombreFruta(item.id_fruta),
            Titulo: item.titulo,
            Tipo: item.tipocontenido,
            URL_o_Información: item.urlcontenido || item.contenidoinformacion,
            Estado: item.estaactivo ? "Activo" : "Inactivo",
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Multimedia");
        XLSX.writeFile(workbook, "multimedia_export.xlsx");
    };

    return (
        <Container fluid style={{ marginLeft: "60px", maxWidth: "95%" }}>
            <Row className="mb-4">
                <Col>
                    <h4>Multimedia</h4>
                    <p className="text-muted">Administra la multimedia conformado por la fruta, título, tipo, imagen e información/URL.</p>
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
                <Col md={8}>
                    <InputGroup>
                        <FormControl
                            placeholder="Buscar por título..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={4}>
                    <Form.Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="">Todos los Tipos</option>
                        <option value="Video">Video</option>
                        <option value="Información">Información</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={8}></Col>
                <Col md={4} className="d-flex justify-content-end align-items-start">
                    <Button variant="danger" className="me-2" onClick={handleAddNew}>+ Agregar</Button>
                    <Button variant="outline-danger" onClick={handleExport}>Exportar</Button>
                </Col>
            </Row>

            <Table hover>
                <thead>
                    <tr>
                        {/*<th>ID Fruta</th>*/}
                        <th>Fruta</th>
                        <th>Título</th>
                        <th>Información/URL</th>
                        <th className="text-center">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => (
                        <tr key={item.id}>
                            {/*<td>{item.id_fruta}</td>*/}
                            <td>{getNombreFruta(item.id_fruta)}</td>
                            <td>{item.titulo}</td>
                            <td>
                                {item.urlcontenido ? (
                                    <a href={item.urlcontenido} target="_blank" rel="noopener noreferrer">
                                        {item.urlcontenido}
                                    </a>
                                ) : (
                                    item.contenidoinformacion
                                )}
                            </td>
                            <td className="text-center">
                                <Link href={`/pages/multimedia/editar?id=${item.id}`} key={item.id}>
                                    <Button variant="outline-primary" size="sm" className="me-2">
                                        <FaEdit /> 
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(item.id)} // Cambiar a handleDelete
                                >
                                    <FaTrashAlt /> 
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Row>
                <Col className="d-flex justify-content-between">
                    <span>Mostrando {indexOfFirstItem + 1} a {indexOfLastItem} de {filteredMultimedia.length} producto(s)</span>
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index + 1 === currentPage}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </Col>
            </Row>
        </Container>
    );
}



