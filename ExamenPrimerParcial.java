import java.util.Scanner;

/**
 * Alumno: Vega Beid David
 * Grupo: 4IV8 | No. lista: 33
 * Examen Primer Parcial
 */
public class ExamenPrimerParcial {

    // Constantes de precios y porcentajes
    private static final double PRECIO_A_LAMINADO = 13.45;
    private static final double PRECIO_B_MARMOLADO = 43.95;
    private static final double PRECIO_C_ACRILICO = 39.24;
    private static final double TASA_DESCUENTO = 0.0725; // 7.25%
    private static final double TASA_IMPUESTO = 0.16;    // 16% de IVA

    // Límite máximo para las medidas (evitar ingresos absurdos)
    private static final double MEDIDA_MAXIMA = 1000.0;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean salir = false;

        System.out.println("=======================================================");
        System.out.println("   SISTEMA DE COTIZACIÓN DE PISOS - 1ER PARCIAL        ");
        System.out.println("=======================================================");

        // Ciclo repetitivo principal
        do {
            System.out.println("\n--- MENÚ PRINCIPAL ---");
            System.out.println("1. Generar nueva cotización");
            System.out.println("2. Salir");
            System.out.print("Seleccione una opción: ");
            
            String opcion = scanner.nextLine().trim();
            
            switch (opcion) {
                case "1":
                    procesarVenta(scanner);
                    break;
                case "2":
                    salir = true;
                    System.out.println("\nSaliendo del sistema... ¡Éxito con ese examen!");
                    break;
                default:
                    System.out.println(">> ERROR: Opción no válida. Por favor, ingrese 1 o 2.");
            }
        } while (!salir);

        scanner.close();
    }

    private static void procesarVenta(Scanner scanner) {
        System.out.println("\n--- DATOS DEL CLIENTE ---");
        
        String nombreCliente = "";
        while (nombreCliente.isEmpty()) {
            System.out.print("Ingrese el nombre completo del comprador: ");
            nombreCliente = scanner.nextLine().trim();
            if (nombreCliente.isEmpty()) {
                System.out.println(">> ERROR: El nombre no puede estar vacío.");
            }
        }

        System.out.println("\n--- MEDIDAS DEL PISO ---");
        // Aquí pasamos el límite máximo a nuestra función de validación
        double ancho = solicitarMedida(scanner, "Ingrese el ANCHO del piso en metros: ", MEDIDA_MAXIMA);
        double largo = solicitarMedida(scanner, "Ingrese el LARGO del piso en metros: ", MEDIDA_MAXIMA);
        
        double areaTotal = ancho * largo;

        System.out.println("\n--- TIPO DE PISO ---");
        System.out.println("A) Laminado porcelanato ($13.45 / m2)");
        System.out.println("B) Marmolado ($43.95 / m2)");
        System.out.println("C) Acrílico ($39.24 / m2)");
        
        double precioMetroCuadrado = 0;
        String tipoPiso = "";
        boolean opcionValida = false;

        while (!opcionValida) {
            System.out.print("Seleccione el tipo de piso (A, B o C): ");
            String seleccion = scanner.nextLine().trim().toUpperCase();
            
            switch (seleccion) {
                case "A":
                    precioMetroCuadrado = PRECIO_A_LAMINADO;
                    tipoPiso = "Laminado Porcelanato";
                    opcionValida = true;
                    break;
                case "B":
                    precioMetroCuadrado = PRECIO_B_MARMOLADO;
                    tipoPiso = "Marmolado";
                    opcionValida = true;
                    break;
                case "C":
                    precioMetroCuadrado = PRECIO_C_ACRILICO;
                    tipoPiso = "Acrílico";
                    opcionValida = true;
                    break;
                default:
                    System.out.println(">> ERROR: Opción incorrecta. Ingrese A, B o C.");
            }
        }

        double subtotal = areaTotal * precioMetroCuadrado;

        System.out.print("\n¿El cliente confirma la compra en este momento? (S/N): ");
        String confirmaStr = scanner.nextLine().trim().toUpperCase();
        boolean confirmaCompra = confirmaStr.equals("S") || confirmaStr.equals("SI");

        double descuento = 0;
        if (confirmaCompra) {
            descuento = subtotal * TASA_DESCUENTO;
        }

        double subtotalConDescuento = subtotal - descuento;
        double impuestos = subtotalConDescuento * TASA_IMPUESTO;
        double totalFinal = subtotalConDescuento + impuestos;

        System.out.println("\n=======================================================");
        System.out.println("                  RESUMEN DE COMPRA                    ");
        System.out.println("=======================================================");
        System.out.println("Cliente: " + nombreCliente);
        System.out.println("Dimensiones: " + ancho + "m x " + largo + "m");
        System.out.printf("Área Total: %.2f metros cuadrados\n", areaTotal);
        System.out.println("Material: " + tipoPiso);
        System.out.println("-------------------------------------------------------");
        System.out.printf("Subtotal:               $ %,.2f\n", subtotal);
        
        if (confirmaCompra) {
            System.out.printf("Descuento (7.25%%):      -$ %,.2f\n", descuento);
        } else {
            System.out.println("Descuento (7.25%):      NO APLICA (Compra no confirmada)");
        }
        
        System.out.printf("Base Gravable:          $ %,.2f\n", subtotalConDescuento);
        System.out.printf("Impuestos (16%% IVA):    + $ %,.2f\n", impuestos);
        System.out.println("-------------------------------------------------------");
        System.out.printf("TOTAL A PAGAR:          $ %,.2f\n", totalFinal);
        System.out.println("=======================================================\n");
    }

    // Método robusto ACTUALIZADO: Ahora bloquea números negativos, letras Y números absurdamente grandes
    private static double solicitarMedida(Scanner scanner, String mensaje, double maximo) {
        double medida = 0;
        boolean valido = false;
        
        while (!valido) {
            System.out.print(mensaje);
            try {
                medida = Double.parseDouble(scanner.nextLine().trim());
                if (medida <= 0) {
                    System.out.println(">> ERROR: La medida debe ser mayor a 0.");
                } else if (medida > maximo) {
                    System.out.println(">> ERROR: La medida excede el límite permitido de " + maximo + " metros. Ingrese un valor realista.");
                } else {
                    valido = true;
                }
            } catch (NumberFormatException e) {
                System.out.println(">> ERROR: Entrada inválida. Por favor, ingrese un número (se aceptan decimales).");
            }
        }
        return medida;
    }
}