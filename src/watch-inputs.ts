import { logger } from "./logger";

export namespace Char {
  function stringify(value: string | Buffer): string {
    if (typeof value === 'string') {
      return value;
    }

    return value.toString('utf-8');
  }

  export function from(str: string, charIndex?: number): number;
  export function from(buffer: Buffer, charIndex?: number): number;
  export function from(arg0: string | Buffer, charIndex = 0): number {
    const str = stringify(arg0);

    return str.charCodeAt(charIndex);
  }
}

export function handleChars(char: number) {
  switch (char) {
    case 3:
    case 4:
    case Char.from('q'):
      logger.log('INFO', `finalizando a execução do programa!`)
      process.exit();
  }

  logger.log('INFO', `caractere pressionado: ${char}`);
}

export function handleData(data: Buffer) {
  const char = Char.from(data);

  handleChars(char);
}

export function watchInputs() {
  const { stdin } = process;

  stdin.on('data', handleData);  
  stdin.setRawMode(true);

  logger.log('INFO', `pressione 'q' para sair!`);
}