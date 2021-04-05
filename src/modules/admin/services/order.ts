import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { IOrder } from 'modules/database/interfaces/order';
import { Order } from 'modules/database/models/order';

import { OrderRepository } from '../repositories/order';

// import { MailService } from 'modules/common/services/mail';
@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    // private passwordService: PasswordService,
    // private mailService: MailService
  ) {}

  public async save(model: IOrder): Promise<Order> {
    // if (!model.roles || model.roles.length === 0) {
    //   throw new BadRequestException('roles-required');
    // }

    // if (model.roles.includes(enRoles.sysAdmin)) {
    //   throw new BadRequestException('not-allowed-to-change-sysAdmin');
    // }

    // if (!model.roles.every(r => listPublicRoles().includes(r))) {
    //   throw new BadRequestException('invalid-roles');
    // }

    if (model.id) return this.update(model);
    return this.create(model);
  }

  public async remove(userId: number, currentUser: ICurrentUser): Promise<void> {
    const order = await this.orderRepository.findById(userId);

    if (!order) {
      throw new NotFoundException('not-found');
    }

    if (order.id === currentUser.id) {
      throw new BadRequestException('not-allowed-remove-current-order');
    }

    // if (order.isSysAdmin()) {
    //   throw new BadRequestException('not-allowed-remove-sysAdmin');
    // }

    return this.orderRepository.remove(userId);
  }

  private async create(model: IOrder): Promise<Order> {
    // const isEmailAvailable = await this.orderRepository.isEmailAvailable(model.email);
    // if (!isEmailAvailable) throw new ConflictException('email-unavailable');

    // const { password, hash } = await this.passwordService.generatePassword();
    // model.password = hash;

    const order = await this.orderRepository.insert(model);
    // await this.mailService.send(order.email, 'Bem Vindo!', 'order-create', { ...order, password });

    return order;
  }

  private async update(model: IOrder): Promise<Order> {
    // const isEmailAvailable = await this.orderRepository.isEmailAvailable(model.email, model.id);
    // if (!isEmailAvailable) throw new ConflictException('email-unavailable');

    const order = await this.orderRepository.findById(model.id);

    if (!order) throw new NotFoundException('not-found');
    // if (order.isSysAdmin()) throw new BadRequestException('not-allowed-to-change-sysAdmin');

    return this.orderRepository.update({ ...order, ...model });
  }
}
