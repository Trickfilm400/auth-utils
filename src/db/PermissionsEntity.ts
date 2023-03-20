import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PermissionsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "varchar", length: 255 })
  //e. g. "https://account.domain.tld"
  issuer: string;
  @Column({ type: "varchar", length: 255 })
  // e. g. "132456787543223"
  unique_userId: string;
  //@Column({ type: "int" })
  // timestamp in seconds, after which user has no permission, theoretically not needed, but for security reasons
  //expires: number;
  @Column({ type: "mediumtext" })
  //json string with permissions (for package like asterisk-perm or similar
  permissions: string;
}
