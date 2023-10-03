// src/trello/trello.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TrelloEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' }) // Map 'name' property to 'name' column in the database
  name: string;

  @Column({ name: 'completed', nullable: true }) // Map 'completed' property to 'completed' column in the database
  completed: boolean;

  @Column({ name: 'dueDate', nullable: true }) // Map 'dueDate' property to 'dueDate' column in the database
  dueDate: string;

  @Column({ name: 'cardId', nullable: true }) // Map 'cardId' property to 'cardId' column in the database
  cardId: string;

}
