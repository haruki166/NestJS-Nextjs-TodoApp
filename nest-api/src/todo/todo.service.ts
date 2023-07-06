import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  //あるユーザーのすべてのタスクを取得する
  getTasks(userId: number): Promise<Task[]> {
    //引数で受けとったuserIdのtaskのみを取得する
    return this.prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createAt: 'desc',
      },
    });
  }

  //特定のタスクを取得
  getTaskById(userId: number, taskId: number): Promise<Task> {
    return this.prisma.task.findFirst({
      where: {
        userId,
        id: taskId,
      },
    });
  }

  //新規のタスクを作成する
  async createTask(userId: number, dto: CreateTaskDto): Promise<Task> {
    const newTask = await this.prisma.task.create({
      data: {
        userId,
        ...dto, //dtoがオブジェクトのため展開している
      },
    });
    return newTask;
  }

  //タスクを更新する
  async updateTaskById(
    userId: number,
    taskId: number,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    //更新しようとしているtaskIdのタスクが存在するのか確認
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    ////タスクが存在しない場合または見つかってもそのタスクのuserIdとログインしているuserIdが
    //一致しない時にエラーを投げる
    if (!task || task.userId !== userId) {
      throw new ForbiddenException('No permision to update');
    }

    ////タスクが存在していてかつそのタスクのuserIdとログインしているuserIdが
    //一致している時のアップデートの処理
    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...dto,
      },
    });
  }

  //タスクを削除する
  async deleteTaskById(userId: number, taskId: number): Promise<void> {
    //削除したいタスクのtaskIdが存在するのか確認
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    ////タスクが見つからない、または見つかったタスクのuserIdとログインしているuserIdが
    //一致しない場合エラーを投げる
    if (!task || task.userId !== userId) {
      throw new ForbiddenException('No permision to delete');
    }

    ////タスクが見つかり、かつそのタスクのuserIdとログインしているユーザーの
    //userIdが一致する時の削除の処理
    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}
