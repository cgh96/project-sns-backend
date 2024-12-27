import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roles, TRoles } from '../const/roles.const';
import { PostModel } from 'src/posts/entities/post.entity';

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    unique: true,
  })
  // 1) 길이 20을 넘지 않을 것
  // 2) 유일무이한 값이 될 것
  nickname: string;

  @Column({
    unique: true,
  })
  // 1) 유일무이한 값이 될 것
  email: string;

  @Column()
  password: string;

  @Column({
    enum: Object.values(Roles),
    default: Roles.USER,
  })
  role: TRoles;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];
}
