"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Pagination, ButtonGroup, Form } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as XLSX from "xlsx";
import axios from "axios";

export default function ListadoPromociones() {
  const router = useRouter();
  /*const [promociones, setPromociones] = useState([
    { id: 1, nombre: "Helado gratis", tipo: "Oferta Especial", descripcion: "Obtén un 100% de descuento en un helado por día de fundación de helados Villizan", fechaInicio: "27/09/24", fechaFin: "27/10/24", descuento: "100%", estado: "Activo" },
    { id: 2, nombre: "50% de Descuento", tipo: "Paquete", descripcion: "Obtén un 30% de descuento en total por llevarte este paquete", fechaInicio: "28/09/24", fechaFin: "28/10/24", descuento: "30%", estado: "Activo" },
    { id: 3, nombre: "Combo Familiar", tipo: "Paquete", descripcion: "10% de descuento por llevar tres sabores diferentes", fechaInicio: "28/09/24", fechaFin: "28/10/24", descuento: "10%", estado: "Inactivo" },
    { id: 4, nombre: "Helado Natural", tipo: "Oferta Especial", descripcion: "Obtén un 50% de descuento por un helado por día de las frutas", fechaInicio: "29/09/24", fechaFin: "29/10/24", descuento: "50%", estado: "Activo" },
    { id: 5, nombre: "2x1 en helados en chocolate", tipo: "Descuento", descripcion: "Llévate 2 helados al 50% de descuento", fechaInicio: "30/09/24", fechaFin: "30/10/24", descuento: "50%", estado: "Activo" },
  ]);*/
  const [promociones, setPromociones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState("activos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("Todos");
  const itemsPerPage = 15;

  // Llamada a la API para listar las promociones
  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/promocion/listarTodos`);
  
        // Ordenar promociones por fecha de inicio, de más reciente a más antigua
        const sortedPromociones = response.data.sort((a, b) => 
          new Date(b.actualizadoen) - new Date(a.actualizadoen)
        );
  
        setPromociones(sortedPromociones);
        console.log(sortedPromociones);
      } catch (error) {
        console.error("Error al obtener las promociones:", error);
      }
    };
  
    fetchPromociones();
  }, []);

  useEffect(() => {
    const fetchAndUpdatePromotions = async () => {
      try {
        // Obtener las promociones
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/productos/listarTodos`);
        const promotions = response.data;
  
        // Obtener la fecha actual en formato "yyyy-MM-dd"
        const today = new Date();
        const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
        // Filtrar las promociones que tienen fechaFin menor a la fecha actual
        const expiredPromotions = promotions.filter(
          (promo) => promo.fechaFin && promo.fechaFin < todayFormatted
        );
  
        // Actualizar cada promoción expirada a inactiva
        await Promise.all(
          expiredPromotions.map(async (promo) => {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/descuento/eliminar/${promo.id}`);
          })
        );
  
        // Refrescar las promociones después de actualizar
        const updatedResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/productos/listarTodos`);
        setAvailableProducts(updatedResponse.data.map((product) => ({
          id: product.id,
          nombre: product.nombre,
        })));
  
        console.log("Promociones expiradas actualizadas a inactivas:", expiredPromotions);
      } catch (error) {
        console.error("Error al actualizar promociones expiradas:", error);
      }
    };
  
    fetchAndUpdatePromotions();
  }, []);
  
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  // Función para eliminar una promoción
  const handleDelete = async (id) => {
    const confirmDelete = confirm("¿Está seguro de que desea eliminar esta promoción?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/descuento/eliminar/${id}`);
      // Actualizar la lista de promociones después de la eliminación
      setPromociones(promociones.filter((promo) => promo.id !== id));
      alert("Promoción eliminada exitosamente.");
    } catch (error) {
      console.error("Error al eliminar la promoción:", error);
      alert("Error al eliminar la promoción. Intente nuevamente.");
    }
  };

  // Filtrado de promociones según el estado seleccionado (Activo/Inactivo) y tipo de promoción
  const filteredPromociones = promociones
    .filter((item) => {
      if (viewType === "activos") return item.estaactivo === true;
      if (viewType === "inactivos") return item.estaactivo === false;
      return true; // "todos" muestra todos los registros
    })
    .filter((item) => item.titulo.toLowerCase().includes(searchTerm.toLowerCase())) // Búsqueda por nombre de promoción
    .filter((item) => selectedTipo === "Todos" || item.tipo === selectedTipo); // Filtrado por tipo de promoción

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPromociones.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPromociones.length / itemsPerPage);

  const handleEdit = (id) => {
    router.push(`/promociones/editar/?id=${id}`);
  };

  const handleAddNew = () => {
    router.push("/promociones/nuevo");
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Asegúrate de que el día tenga dos dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };  

  const formatFechaHora = (fechaString) => {
    const fecha = new Date(fechaString);
    const fechaFormateada = fecha.toLocaleDateString();
    const horaFormateada = fecha.toLocaleTimeString();
    return { fechaFormateada, horaFormateada };
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
      </Row>

      {/* Barra de Acciones */}
      <Row className="mb-4">
        <Col md={8}></Col>
        <Col md={4} className="d-flex justify-content-end align-items-start">
          <Button variant="danger" className="me-2" onClick={handleAddNew}>+ Agregar</Button>
          <Button variant="outline-danger" onClick={handleExport}>Exportar</Button>
        </Col>
      </Row>

      {/* Tabla de Promociones */}
      <Table hover>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Id Promoción</th>
            <th style={{ textAlign: "left" }}>Nombre</th>
            <th style={{ textAlign: "left" }}>Descripción</th>
            <th style={{ textAlign: "center" }}>Fecha Inicio</th>
            <th style={{ textAlign: "center" }}>Fecha Fin</th>
            <th style={{ textAlign: "center" }}>Descuento (%)</th>
            <th style={{ textAlign: "center" }}>Límite Stock</th>
            <th style={{ width: "10%" , textAlign: "center" }}>Usuario Actualización</th>
            <th style={{ textAlign: "center" }}>Fecha Actualización</th>
            <th style={{ textAlign: "center" }}>Hora Actualización</th>
            <th className="text-center">Acciones</th>
            <th style={{ textAlign: "center" }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => {
            const { fechaFormateada, horaFormateada } = formatFechaHora(item.actualizadoen);
            return (
            <tr key={item.id}>
              <td style={{ textAlign: "left" }}>{item.id}</td>
              <td style={{ textAlign: "left" }}>{item.titulo}</td>
              <td style={{ textAlign: "left" }}>{truncateText(item.descripcion, 10)}</td>
              <td style={{ textAlign: "center" }}>{formatDate(item.fechainicio)}</td>
              <td style={{ textAlign: "center" }}>{formatDate(item.fechafin)}</td>
              <td style={{ textAlign: "center" }}>{item.porcentajedescuento}</td>
              <td style={{ textAlign: "center" }}>{item.limitestock}</td>
              <td style={{ textAlign: "center" }}>{item.usuarioactualizacion}</td>
              <td style={{ textAlign: "center" }}>{fechaFormateada}</td>
              <td style={{ textAlign: "center" }}>{horaFormateada}</td>
              <td className="text-center">
                {/* Botones de Edición y Eliminación */}
                <Link href={`/promociones/editar/?id=${item.id}`} key={item.id}>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    <FaEdit /> 
                  </Button>
                </Link>
              </td>
              <td className="text-center">
                  <Button 
                      variant={item.estaactivo ? "success" : "danger"} 
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                  >
                      {item.estaactivo ? "Activo" : "Inactivo"}
                  </Button>
              </td>
            </tr>
            );
                
          })}
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