"use client";

import React, { useState } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Pagination, ButtonGroup, Form } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function ListadoNotificaciones() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, asunto: "¡Descuento Exclusivo!", tipo: "Oferta Especial", mensaje: "Estimado PlaceHolder, ¡Descuento Exclusivo! Aprovecha nuestra Oferta Especial válida hasta el 2024-10-01", promocion: "Paleta de fresa gratis, 2x1 en mafeletas", estado: "Activo" },
    { id: 2, asunto: "Promoción de Temporada", tipo: "Descuentos", mensaje: "Estimado PlaceHolder, ¡Promoción de Temporada! Aprovecha nuestra Puntos Dobles válida hasta el 2024-10-10", promocion: "Mafeleta de 3 sabores al 50%, Paleta glaseada de fresa gratis", estado: "Activo" },
    { id: 3, asunto: "Oferta Especial", tipo: "Expiración de Puntos", mensaje: "Estimado PlaceHolder, Aprovecha nuestra Puntos Dobles válida hasta el 2024-09-05", promocion: "Paleta de fresa gratis, Mafeleta de 3 sabores al 50%, 2x1 en mafeletas", estado: "Inactivo" },
    { id: 4, asunto: "Puntos Dobles", tipo: "Oferta Especial", mensaje: "Estimado PlaceHolder, ¡Puntos Dobles! Aprovecha nuestra Oferta Especial válida hasta el 2024-09-03", promocion: "Paleta de fresa gratis", estado: "Activo" },
    { id: 5, asunto: "Oferta Especial", tipo: "Descuento", mensaje: "Estimado PlaceHolder, ¡Oferta Especial! Aprovecha nuestra Descuento válida", promocion: "Paleta especial sabor a sandía al 50%, Paleta de fresa gratis", estado: "Inactivo" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState("Activo");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const itemsPerPage = 5;

  // Filtrado de notificaciones según el estado seleccionado (Activo/Inactivo) y otros filtros
  const filteredNotificaciones = notificaciones
    .filter((item) => item.estado === viewType)
    .filter((item) => item.asunto.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((item) => (filterType ? item.tipo === filterType : true))
    .filter((item) => {
      const fechaInicio = new Date(item.fechaInicio);
      const fechaFin = new Date(item.fechaFin);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (!start || fechaInicio >= start) && (!end || fechaFin <= end);
    });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNotificaciones.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotificaciones.length / itemsPerPage);

  const handleEdit = (id) => {
    router.push(`/pages/notificaciones/editar/?id=${id}`);
  };

  const handleAddNew = () => {
    router.push("/pages/notificaciones/nuevo");
  };

  // Función para exportar datos a CSV
  const handleExport = () => {
    // Crear una nueva hoja de trabajo con los datos
    const worksheetData = filteredNotificaciones.map((item) => ({
      ID: item.id,
      Asunto: item.asunto,
      Tipo: item.tipo,
      Mensaje: item.mensaje,
      Promocion: item.promocion,
      Estado: item.estado,
    }));

    // Crear un libro de trabajo (workbook) y agregar la hoja
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Notificaciones");

    // Generar el archivo Excel
    XLSX.writeFile(workbook, "notificaciones_export.xlsx");
  };

  return (
    <Container fluid style={{ marginLeft: "60px", maxWidth: "95%" }}>
      {/* Breadcrumb y Filtro de Activos/Inactivos */}
      <Row className="mb-4">
        <Col>
          <h4>Notificaciones</h4>
          <p className="text-muted">Administra las notificaciones conformadas por el asunto, tipo, descripción y promociones.</p>
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

      {/* Barra de Búsqueda y Filtros Adicionales */}
      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <FormControl
              placeholder="Buscar por asunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            onChange={(e) => setFilterType(e.target.value)}
            value={filterType}
          >
            <option value="">Todos los Tipos</option>
            <option value="Oferta Especial">Oferta Especial</option>
            <option value="Descuentos">Descuentos</option>
            <option value="Expiración de Puntos">Expiración de Puntos</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Barra de Acciones */}
      <Row className="mb-4">
        <Col md={8}></Col>
        <Col md={4} className="d-flex justify-content-end align-items-start">
          <Button variant="danger" className="me-2" onClick={handleAddNew}>+ Agregar</Button>
          <Button variant="outline-danger" onClick={handleExport}>Exportar</Button>
        </Col>
      </Row>

            {/* Tabla de Notificaciones */}
            <Table hover>
        <thead>
          <tr>
            <th>Asunto</th>
            <th>Tipo</th>
            <th>Mensaje</th>
            <th>Promoción</th>
            <th className="text-center">Opciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <tr key={item.id}>
                <td>{item.asunto}</td>
                <td>{item.tipo}</td>
                <td>{item.mensaje}</td>
                <td>{item.promocion}</td>
                <td className="text-center">
                  {/* Botones de Edición y Eliminación */}
                  <Link href={`/pages/notificaciones/editar/?id=${item.id}`} key={item.id}>
                    <Button variant="outline-primary" size="sm" className="me-2">
                      <FaEdit /> 
                    </Button>
                  </Link>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => alert(`Eliminando ${item.asunto}`)}
                  >
                    <FaTrashAlt /> 
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No se encontraron notificaciones.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Paginador */}
      <Row>
        <Col className="d-flex justify-content-between">
          <span>Mostrando {indexOfFirstItem + 1} a {indexOfLastItem} de {filteredNotificaciones.length} producto(s)</span>
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