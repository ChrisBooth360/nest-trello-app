// src/trello/trello.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class TrelloEntity {
  @PrimaryColumn({ name: 'cardId', type: 'varchar', length: 255 })
  cardId: string;

  @Column({ name: 'name' }) // Map 'name' property to 'name' column in the database
  name: string;

  @Column({ name: 'description', nullable: true }) // Map 'completed' property to 'completed' column in the database
  description: string;

  @Column({ name: 'dueDate', nullable: true }) // Map 'dueDate' property to 'dueDate' column in the database
  dueDate: string;

}
