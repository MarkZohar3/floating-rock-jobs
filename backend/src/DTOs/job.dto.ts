import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JobDto {
  @ApiProperty({ example: 'Fullstack Developer' })
  title: string;

  @ApiProperty({ example: 'Spotify' })
  company: string;

  @ApiPropertyOptional({ example: 'Ljubljana' })
  location?: string;
}
