import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TodoService } from './todo.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  //ユーザーのタスクをすべて取得API
  @Get()
  getTasks(@Req() req: Request): Promise<Task[]> {
    ////jwt.strategy.tsのvalidateの返り値が
    //NestJSによってリクエストに含まれるためそれをgetTasksに渡す
    return this.todoService.getTasks(req.user.id);
  }

  //特定のタスクを取得API
  @Get(':id')
  getTaskById(
    @Req() req: Request,
    //パラメータの:idを数値型にパースしてそれをtaskIdにぶち込む
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<Task> {
    return this.todoService.getTaskById(req.user.id, taskId);
  }

  //新規タスクを作成API
  @Post()
  createTask(@Req() req: Request, @Body() dto: CreateTaskDto): Promise<Task> {
    return this.todoService.createTask(req.user.id, dto);
  }

  //タスク更新API
  @Patch(':id')
  updateTaskById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    return this.todoService.updateTaskById(req.user.id, taskId, dto);
  }

  //タスク削除API
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTaskById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<void> {
    return this.todoService.deleteTaskById(req.user.id, taskId);
  }
}
