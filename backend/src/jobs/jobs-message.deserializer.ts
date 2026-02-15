import { Deserializer } from '@nestjs/microservices';

const JOBS_PATTERN = 'jobs';

export class JobsMessageDeserializer implements Deserializer<unknown, unknown> {
  deserialize(value: unknown): unknown {
    const parsedValue = this.parseValue(value);

    if (
      typeof parsedValue === 'object' &&
      parsedValue !== null &&
      'pattern' in parsedValue &&
      'data' in parsedValue
    ) {
      return parsedValue;
    }

    return {
      pattern: JOBS_PATTERN,
      data: parsedValue,
    };
  }

  private parseValue(value: unknown): unknown {
    if (Buffer.isBuffer(value)) {
      const text = value.toString('utf8');
      try {
        return JSON.parse(text) as unknown;
      } catch {
        return text;
      }
    }

    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as unknown;
      } catch {
        return value;
      }
    }

    return value;
  }
}
