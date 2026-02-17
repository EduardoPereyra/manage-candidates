import { IsString, IsEnum, IsNumber, IsBoolean } from 'class-validator';

export class CreateCandidateDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEnum(['junior', 'senior'])
  seniority: 'junior' | 'senior';

  @IsNumber()
  yearsOfExperience: number;

  @IsBoolean()
  availability: boolean;
}
