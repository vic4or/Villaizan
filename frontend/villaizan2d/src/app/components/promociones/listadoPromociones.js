"use client";

import React, { useState } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Pagination, ButtonGroup, Form } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function ListadoPromociones() {
  const router = useRouter();
  const [promociones, setPromociones] = useState([
    { id: 1, nombre: "Helado gratis", tipo: "Oferta Especial", descripcion: "Obtén un 100% de descuento en un helado por día de fundación de helados Villizan", fechaInicio: "27/09/24", fechaFin: "27/10/24", descuento: "100%", estado: "Activo" },
    { id: 2, nombre: "50% de Descuento", tipo: "Paquete", descripcion: "Obtén un 30% de descuento en total por llevarte este paquete", fechaInicio: "28/09/24", fechaFin: "28/10/24", descuento: "30%", estado: "Activo" },
    { id: 3, nombre: "Combo Familiar", tipo: "Paquete", descripcion: "10% de descuento por llevar tres sabores diferentes", fechaInicio: "28/09/24", fechaFin: "28/10/24", descuento: "10%", estado: "Inactivo" },
    { id: 4, nombre: "Helado Natural", tipo: "Oferta Especial", descripcion: "Obtén un 50% de descuento por un helado por día de las frutas", fechaInicio: "29/09/24", fechaFin: "29/10/24", descuento: "50%", estado: "Activo" },
    { id: 5, nombre: "2x1 en helados en chocolate", tipo: "Descuento", descripcion: "Llévate 2 helados al 50% de descuento", fechaInicio: "30/09/24", fechaFin: "30/10/24", descuento: "50%", estado: "Activo" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState("Activo");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("Todos");
  const itemsPerPage = 5;

  // Filtrado de promociones según el estado seleccionado (Activo/Inactivo) y tipo de promoción
  const filteredPromociones = promociones
    .filter((item) => item.estado === viewType)
    .filter((item) => item.nombre.toLowerCase().includes(searchTerm.toLowerCase())) // Búsqueda por nombre de promoción
    .filter((item) => selectedTipo === "Todos" || item.tipo === selectedTipo); // Filtrado por tipo de promoción

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPromociones.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPromociones.length / itemsPerPage);

  const handleEdit = (id) => {
    router.push(`/pages/promociones/editar/?id=${id}`);
  };

  const handleAddNew = () => {
    router.push("/pages/promociones/nuevo");
  };

  // Función para exportar datos a CSV
  const handleExport = () => {
    // Crear una nueva hoja de trabajo con los datos
    const worksheetData = filteredPromociones.map((item) => ({
      ID: item.id,
      Nombre: item.nombre,
      Tipo: item.tipo,
      Descripción: item.descripcion,
      FechaInicio: item.fechaInicio,
      FechaFin: item.fechaFin,
      Descuento: item.descuento,
      Estado: item.estado,
    }));

    // Crear un libro de trabajo (workbook) y agregar la hoja
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Promociones");

    // Generar el archivo Excel
    XLSX.writeFile(workbook, "promociones_export.xlsx");
  };

  return (
    <Container fluid style={{ marginLeft: "60px", maxWidth: "95%" }}>
      {/* Breadcrumb y Filtro de Activos/Inactivos */}
      <Row className="mb-4">
        <Col>
          <h4>Promociones</h4>
          <p className="text-muted">Administra las promociones conformadas por el nombre, tipo, descripción, fecha inicio, fecha fin y descuento.</p>
        </Col>
      </Row>

      {/* Filtro de Activos e Inactivos */}
      <Row className="mb-3">
        <Col>
          <ButtonGroup>
            <Button
              variant={viewType === "Activo" ? "danger" : "outline-danger"}
              style={{
                backgroundColor: viewType === "Activo" ? "rgba(230, 57, 70, 0.8)" : "transparent",
                borderColor: "rgba(230, 57, 70, 0.6)",
                color: viewType === "Activo" ? "#fff" : "rgba(230, 57, 70, 0.8)",
              }}
              onClick={() => setViewType("Activo")}
            >
              Activos
            </Button>
            <Button
              variant={viewType === "Inactivo" ? "danger" : "outline-danger"}
              style={{
                backgroundColor: viewType === "Inactivo" ? "rgba(230, 57, 70, 0.8)" : "transparent",
                borderColor: "rgba(230, 57, 70, 0.6)",
                color: viewType === "Inactivo" ? "#fff" : "rgba(230, 57, 70, 0.8)",
              }}
              onClick={() => setViewType("Inactivo")}
            >
              Inactivos
            </Button>
            <Button
              variant={viewType === "Todos" ? "danger" : "outline-danger"}
              style={{
                  backgroundColor: viewType === "Inactivo" ? "rgba(230, 57, 70, 0.8)" : "transparent",
                  borderColor: "rgba(230, 57, 70, 0.6)",
                  color: viewType === "Todos" ? "#fff" : "rgba(230, 57, 70, 0.8)",
              }}
              onClick={() => setViewType("Todos")}
          >
              Todos
          </Button>
          </ButtonGroup>
        </Col>
      </Row>

      {/* Barra de Búsqueda y Filtro de Tipo de Promoción */}
      <Row className="mb-3">
        <Col md={8}>
          <InputGroup>
            <FormControl
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select value={selectedTipo} onChange={(e) => setSelectedTipo(e.target.value)}>
            <option value="Todos">Todos los tipos</option>
            <option value="Oferta Especial">Oferta Especial</option>
            <option value="Paquete">Paquete</option>
            <option value="Descuento">Descuento</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Barra de Acciones */}
      <Row className="mb-4">
        <Col md={8}></Col>
        <Col md={4} className="d-flex justify-content-end align-items-start">
          <Button variant="outline-secondary" className="me-2">Filtrar</Button>
          <Button variant="danger" className="me-2" onClick={handleAddNew}>+ Agregar</Button>
          <Button variant="outline-danger" onClick={handleExport}>Exportar</Button>
        </Col>
      </Row>

      {/* Tabla de Promociones */}
      <Table hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Descuento</th>
            <th className="text-center">Opciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{item.tipo}</td>
              <td>{item.descripcion}</td>
              <td>{item.fechaInicio}</td>
              <td>{item.fechaFin}</td>
              <td>{item.descuento}</td>
              <td className="text-center">
                {/* Botones de Edición y Eliminación */}
                <Link href={`/pages/promociones/editar/?id=${item.id}`} key={item.id}>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    <FaEdit /> 
                  </Button>
                </Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => alert(`Eliminando ${item.nombre}`)}
                >
                  <FaTrashAlt /> 
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Paginador */}
      <Row>
        <Col className="d-flex justify-content-between">
          <span>Mostrando {indexOfFirstItem + 1} a {indexOfLastItem} de {filteredPromociones.length} producto(s)</span>
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