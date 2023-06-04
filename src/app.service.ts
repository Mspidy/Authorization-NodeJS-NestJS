import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { TodoList } from './todo.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TodoList)
    private readonly todolistRepository: Repository<TodoList>
  ) { }

  async register(data: any): Promise<User> {
    return this.userRepository.save(data);
  }

  async findOne(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: any) {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneUser(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }


  //------------------now write for another entity (Todo Entity)

  create(createBrandDto: any) {
    return this.todolistRepository.save(createBrandDto);
  }

  findAll() {
    return this.todolistRepository.find();
  }

  findOneTodo(id: number) {
    return this.todolistRepository.findOne({ where: { id: id } });
  }

  update(id: number, updateBrandDto: any) {
    return this.todolistRepository.update(id, updateBrandDto);
  }

  remove(id: number) {
    return this.todolistRepository.delete(id);
  }

}
