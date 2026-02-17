import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Candidate } from './entities/candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ExcelData } from './interfaces/excel-data.interface';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private candidatesRepository: Repository<Candidate>,
  ) {}

  async processExcel(file: Express.Multer.File): Promise<ExcelData> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (data.length !== 1) {
        throw new BadRequestException(
          'El archivo Excel debe contener exactamente una fila',
        );
      }

      const excelData = data[0] as any;

      return {
        seniority: excelData.seniority?.toLowerCase(),
        yearsOfExperience: Number(excelData.yearsOfExperience),
        availability: Boolean(excelData.availability),
      };
    } catch (error) {
      throw new BadRequestException('Error procesando el archivo Excel');
    }
  }

  async create(createCandidateDto: CreateCandidateDto): Promise<Candidate> {
    const candidate = this.candidatesRepository.create(createCandidateDto);
    return await this.candidatesRepository.save(candidate);
  }

  async createFromForm(
    name: string,
    surname: string,
    excelFile: Express.Multer.File,
  ): Promise<Candidate> {
    const excelData = await this.processExcel(excelFile);

    const createCandidateDto: CreateCandidateDto = {
      name,
      surname,
      ...excelData,
    };

    return this.create(createCandidateDto);
  }

  async findAll(): Promise<Candidate[]> {
    return await this.candidatesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Candidate> {
    const candidate = await this.candidatesRepository.findOne({
      where: { id },
    });
    if (!candidate) {
      throw new BadRequestException('Candidato no encontrado');
    }
    return candidate;
  }

  async update(
    id: number,
    updateCandidateDto: UpdateCandidateDto,
  ): Promise<Candidate> {
    await this.candidatesRepository.update(id, updateCandidateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.candidatesRepository.delete(id);
  }
}
