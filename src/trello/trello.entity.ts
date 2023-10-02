// src/trello/trello.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TrelloEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Add more properties as needed
}
