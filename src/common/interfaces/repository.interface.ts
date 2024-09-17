/**
 * Interface generic repository
 */
export interface IRepository<T, CreateDto = T, UpdateDto = T> {
  create(entity: CreateDto): Promise<T>;
  update(id: string, entity: UpdateDto): Promise<T | null>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
}
