import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(email: string, password: string) {
    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }

  getAllUsers() {
    return this.userRepository.find({});
  }

  find(email: string) {
    return this.userRepository.find({ where: { email } });
  }

  getUserById(id: number) {
    if (id) return this.userRepository.findOne({ where: { id } });
    return null;
  }

  async updateUser(id: number, attrs: Partial<User>) {
    const user = await this.getUserById(id);
    if (!user) throw new NotFoundException('User not found!');
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async removeUser(id: number) {
    const user = await this.getUserById(id);
    if (!user) throw new NotFoundException('User not found!');
    return this.userRepository.remove(user);
  }
}
