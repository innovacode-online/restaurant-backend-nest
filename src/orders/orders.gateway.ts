import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: "/orders", cors: { origin: 'http://localhost:5173', } })
export class OrdersGateway {
  constructor(private readonly ordersService: OrdersService) { }

  @WebSocketServer()
  server: Server;

  // Cuando un cliente se conecta, puedes mandar órdenes directamente
  // o dejar que el cliente emita "getOrders" y responder con "ordersList"
  async handleConnection(client: Socket) {
    console.log('Cliente conectado:', client.id);
    const orders = await this.ordersService.findAll()
    this.server.emit('refreshOrders', { orders })
  }

  @SubscribeMessage('createOrder')
  async create(@MessageBody() createOrderDto: CreateOrderDto) {
    await this.ordersService.create(createOrderDto)
    const orders = await this.ordersService.findAll()
    this.server.emit('refreshOrders', { orders })
  }
}
