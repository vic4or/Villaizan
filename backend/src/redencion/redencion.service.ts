import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { vi_redencion } from '@prisma/client';
import { CreateRedencionDto } from './dto/create-redencion.dto';


@Injectable()
export class RedencionService {
    constructor(private prisma: PrismaService) {}

    // Pantallas administrador
    async getAllRedenciones(): Promise<vi_redencion[]> {
        return await this.prisma.vi_redencion.findMany({
            include: {
                vi_detalleredencion: {
                    include: {
                        vi_producto: true,
                    },
                },
                vi_usuario: {
                    include: { vi_persona: true },
                }
            },
            orderBy: { fechageneracion: 'desc' },
        });
    }

    async getRedencionById(id: string): Promise<vi_redencion> {
        return await this.prisma.vi_redencion.findUnique({
            where: { id },
            include: { 
                vi_detalleredencion: {
                    include: { vi_producto: true },
                    where: { estaactivo: true },
                }
            },
        });
    }

    // Validar una redención (cambiar estado a 'CANJEADO')
    async validarRedencion(id: string): Promise<vi_redencion> {
        return await this.prisma.$transaction(async (prisma) => {
            // Actualizar la redención a "Canjeado"
            const redencion = await prisma.vi_redencion.update({
                where: { id },
                data: {
                    estado: "Canjeado",
                    actualizadoen: new Date(),
                    fecharedencion: new Date(),
                    usuarioactualizacion: "admin", // TODO: Cambiar por usuario logueado
                },
            });
    
            const idUsuario = redencion.id_usuario;
            const puntosCanjeados = redencion.puntoscanjeado;
    
            await prisma.vi_usuario.update({
                where: { id: idUsuario },
                data: {
                    puntosacumulados: {
                        decrement: puntosCanjeados, // Resta los puntos redimidos
                    },
                    actualizadoen: new Date(),
                    usuarioactualizacion: "admin", // TODO: Cambiar por usuario logueado
                },
            });
    
            return redencion;
        });
    }



    // Pantallas usuario

    private async obtenerUltimoIdDetalleRedencion(): Promise<number> {
        const ultimoRegistro = await this.prisma.vi_detalleredencion.findFirst({
          orderBy: { id: 'desc' },
        });
    
        const ultimoId = ultimoRegistro ? parseInt(ultimoRegistro.id, 10) : 0;
    
        return ultimoId;
    }

    private async generarIdRedencion(): Promise<string> {
        const ultimoRegistro = await this.prisma.vi_redencion.findFirst({
          orderBy: { id: 'desc' }, 
        });

        const ultimoId = ultimoRegistro ? parseInt(ultimoRegistro.id, 10) : 0;
      
        return (ultimoId + 1).toString();
    }

    // Crear una redención
    async createRedencionConDetalles(data: CreateRedencionDto) {
        return await this.prisma.$transaction(async (prisma) => {
          // Generar el ID para la redención
          const idRedencion = await this.generarIdRedencion();
          console.log("idRedencion: ", idRedencion);
          const fecha_generacion = new Date();

          const fecha_expiracion = new Date(fecha_generacion);
          fecha_expiracion.setDate(fecha_expiracion.getDate() + 60); // 60 días de expiracion
    
          // Crear la redención
          const redencion = await prisma.vi_redencion.create({
            data: {
              id: idRedencion,
              id_usuario: data.id_usuario,
              puntoscanjeado: data.puntoscanjeado,
              fechageneracion: fecha_generacion,
              fechaexpiracion: fecha_expiracion,
              codigo: data.codigo,
              estado: "Creado",
              //usuariocreacion: data.usuariocreacion,
              usuariocreacion: "admin",
            },
          });
          
          let idDetalle = await this.obtenerUltimoIdDetalleRedencion();
          console.log("idDetalle: ", idDetalle);
          for (const detalle of data.detalles) {
            // Generar el ID para cada detalle
            idDetalle += 1;
            
    
            await prisma.vi_detalleredencion.create({
              data: {
                id: idDetalle.toString(),
                id_redencion: redencion.id,
                id_recompensa: detalle.id_recompensa,
                id_producto: detalle.id_producto,
                puntosredencion: detalle.puntosredencion,
                cantidad: detalle.cantidad,
                subtotalpuntosredencion: detalle.subtotalpuntosredencion,
                usuariocreacion: detalle.usuariocreacion,
              },
            });
          }
    
          return redencion; // Retorna la redención creada
        });
    }
    

    // Listar redenciones por usuario (TODAS PARA UNA VISUALIZACION DE REDENCIONES DEL USUARIO SIN CONSIDERAR EL ESTADO)
    async getRedencionesByUser(idUsuario: string): Promise<vi_redencion[]> {
        return await this.prisma.vi_redencion.findMany({
            where: { id_usuario: idUsuario,
                //estaactivo: true
             },
            include: {
                vi_detalleredencion: {
                    include: {
                        vi_producto: true,
                    },
                    //where: { estaactivo: true },
                },
            },
            orderBy: { fechageneracion: 'desc' },
        });
    }

    // Listar redenciones por usuario y estado 'CANJEADO' (TODAS PARA UNA TABLA DE TRANSACCIONES DEL USUARIO)
    async getRedencionByUserAndEstadoCanjeado(idUsuario: string): Promise<vi_redencion[]> {
        return await this.prisma.vi_redencion.findMany({
            where: { id_usuario: idUsuario, estado:'Canjeado' },
            include: {
                vi_detalleredencion: {
                    include: {
                        vi_producto: true,
                    },
                    where: { estaactivo: true },
                },
            },
            orderBy: { fecharedencion: 'desc' },
        });
    }

    // Desactivar redención
    async inactivateRedencion(id: string, idUsuario:string): Promise<vi_redencion> {
        return await this.prisma.$transaction(async (prisma) => {
            // Desactivar la redencion
            const redencion = await prisma.vi_redencion.update({
                where: { id },
                data: {
                    estaactivo: false,
                    actualizadoen: new Date(),
                    desactivadoen: new Date(),
                    usuarioactualizacion: idUsuario,
                },
            });
    
            // Desactivar los detalles de la redencion
            await prisma.vi_detalleredencion.updateMany({
                where: { id_redencion: id },
                data: {
                    estaactivo: false,
                    actualizadoen: new Date(),
                    desactivadoen: new Date(),
                    usuarioactualizacion: idUsuario,
                },
            });
    
            return redencion;
        }
        );
    }
}