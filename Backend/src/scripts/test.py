import argparse

# Crear el parser
parser = argparse.ArgumentParser(description="Descripción de lo que hace tu script")

# Añadir argumentos
parser.add_argument('nombre', type=str, help='Nombre de la persona')
parser.add_argument('edad', type=int, help='Edad de la persona')
parser.add_argument('--ciudad', type=str, default='Desconocida', help='Ciudad de residencia (opcional)')

# Parsear los argumentos
args = parser.parse_args()

# Usar los argumentos
print(f"Hola, {args.nombre}. Tienes {args.edad} años y vives en {args.ciudad}.")