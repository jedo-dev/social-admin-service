import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new Role();
    role.name = createRoleDto.name;

    // Save the role to the database
    return await role.save();
  }

  async findAll(): Promise<Role[]> {
    const allRoles = await Role.find();
    return allRoles;
  }

  async findOne(id: number): Promise<Role> {
    const role = await Role.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await Role.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    role.name = updateRoleDto.name || role.name;

    return await role.save();
  }

  async remove(id: number): Promise<void> {
    const role = await Role.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Delete the role from the database
    await role.remove();
  }
}
