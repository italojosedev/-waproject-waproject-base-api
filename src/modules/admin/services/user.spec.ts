import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IOrder } from 'modules/database/interfaces/order';

import { OrderRepository } from '../repositories/order';
import { OrderService } from './order';

// import { MailService } from 'modules/common/services/mail';
// import { PasswordService } from 'modules/common/services/password';
// import { enRoles,  } from 'modules/database/interfaces/order';
/* eslint-disable max-len */
describe('Admin/OrderService', () => {
  // let mailService: MailService;
  let orderRepository: OrderRepository;
  // let passwordService: PasswordService;
  let service: OrderService;

  const order: IOrder = {
    description: 'description',
    quantity: 1,
    value: 1,
    createdBy: 1
  };

  beforeEach(async () => {
    // mailService = new MailService(null);
    orderRepository = new OrderRepository();
    // passwordService = new PasswordService();

    service = new OrderService(orderRepository);
  });

  it('should create a order', async () => {
    jest.spyOn(orderRepository, 'isEmailAvailable').mockResolvedValueOnce(true);
    // jest.spyOn(passwordService, 'generatePassword').mockResolvedValueOnce({ password: '123', hash: '123hash' });
    jest.spyOn(orderRepository, 'insert').mockImplementationOnce(order => Promise.resolve({ ...order } as any));
    // jest.spyOn(mailService, 'send').mockImplementationOnce((to, subject, template, data) => {
    //   expect(to).toBe('test@email.com');
    //   expect(subject).toBe('Bem Vindo!');
    //   expect(template).toBe('order-create');
    //   expect(data.password).toBe('123');
    //   return Promise.resolve(null);
    // });

    const result = await service.save(order);

    expect(result).not.toBeFalsy();
    expect(result).toEqual(order);
  });

  it('should update a order', async () => {
    // jest.spyOn(orderRepository, 'isEmailAvailable').mockResolvedValueOnce(true);
    // jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ isSysAdmin: () => false } as any);
    jest.spyOn(orderRepository, 'update').mockImplementationOnce(order => Promise.resolve({ ...order } as any));

    const result = await service.save({ id: 1, ...order });

    expect(result).not.toBeFalsy();
    // delete result.isSysAdmin;
    expect(result).toEqual({ id: 1, ...order });
  });

  it('should throw ConflictException with message email-unavailable when try create a order with email duplicated', async () => {
    jest.spyOn(orderRepository, 'isEmailAvailable').mockResolvedValueOnce(false);

    try {
      await service.save(order);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictException);
      expect(err.message.message).toBe('email-unavailable');
    }
  });

  it('should throw ConflictException with message email-unavailable when try update a order with email duplicated', async () => {
    jest.spyOn(orderRepository, 'isEmailAvailable').mockResolvedValueOnce(false);

    try {
      await service.save({ id: 1, ...order });
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictException);
      expect(err.message.message).toBe('email-unavailable');
    }
  });

  it('should throw NotFoundException when try update a not found order', async () => {
    jest.spyOn(orderRepository, 'isEmailAvailable').mockResolvedValueOnce(true);
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce(null);

    try {
      await service.save({ id: 1, ...order });
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should throw BadRequestException with message not-allowed-to-change-sysAdmin when try update a sysAdmin order', async () => {
    jest.spyOn(orderRepository, 'isEmailAvailable').mockResolvedValueOnce(true);
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ isSysAdmin: () => true } as any);

    try {
      await service.save({ id: 1, ...order });
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toBe('not-allowed-to-change-sysAdmin');
    }
  });

  it('should throw BadRequestException with message invalid-roles when try save a order with a invalid role', async () => {
    jest.spyOn(orderRepository, 'isEmailAvailable').mockResolvedValueOnce(true);
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ isSysAdmin: () => true } as any);

    try {
      await service.save({ id: 1, ...order });
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toBe('invalid-roles');
    }
  });

  it('should throw BadRequestException with message invalid-roles when try save a order with a sysAdmin role', async () => {
    jest.spyOn(orderRepository, 'isEmailAvailable').mockResolvedValueOnce(true);
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ isSysAdmin: () => true } as any);

    try {
      await service.save({ id: 1, ...order});
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toBe('not-allowed-to-change-sysAdmin');
    }
  });

  it('should throw BadRequestException with message invalid-roles when try save a order with a sysAdmin role', async () => {
    jest.spyOn(orderRepository, 'isEmailAvailable').mockResolvedValueOnce(true);
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ isSysAdmin: () => true } as any);

    try {
      await service.save({ id: 1, ...order});
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toBe('roles-required');
    }
  });

  it('should remove a order', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ id: 2, isSysAdmin: () => false } as any);
    jest.spyOn(orderRepository, 'remove').mockResolvedValueOnce({ id: 2 } as any);

    await service.remove(2, { id: 1 } as any);
  });

  it('should throw BadRequestException with message not-allowed-remove-sysAdmin when try to remove a order with a sysAdmin role', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ id: 2, isSysAdmin: () => true } as any);

    try {
      await service.remove(2, { id: 1 } as any);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toBe('not-allowed-remove-sysAdmin');
    }
  });

  it('should throw BadRequestException with message not-allowed-remove-current-order when try to remove the current order', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ id: 2 } as any);

    try {
      await service.remove(2, { id: 2 } as any);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message.message).toBe('not-allowed-remove-current-order');
    }
  });

  it('should throw NotFoundException when try to remove a not found order', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce(null);

    try {
      await service.remove(2, { id: 2 } as any);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
});
