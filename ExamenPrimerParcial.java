import java.util.Scanner;

public class ExamenPrimerParcial {

    // Constantes de precios y porcentajes
    private static final double PRECIO_A_LAMINADO = 13.45;
    private static final double PRECIO_B_MARMOLADO = 43.95;
    private static final double PRECIO_C_ACRILICO = 39.24;
    private static final double TASA_DESCUENTO = 0.0725; // 7.25%
    private static final double TASA_IMPUESTO = 0.16;    // 16% de IVA

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean salir = false;

        System.out.println("=======================================================");
        System.out.println("   SISTEMA DE COTIZACIÓN DE PISOS - 1ER PARCIAL        ");
        System.out.println("=======================================================");

        // Ciclo repetitivo principal hasta que el usuario elija salir
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
        
        // Validación del nombre (no puede estar vacío)
        String nombreCliente = "";
        while (nombreCliente.isEmpty()) {
            System.out.print("Ingrese el nombre completo del comprador: ");
            nombreCliente = scanner.nextLine().trim();
            if (nombreCliente.isEmpty()) {
                System.out.println(">> ERROR: El nombre no puede estar vacío.");
            }
        }

        System.out.println("\n--- MEDIDAS DEL PISO ---");
        double ancho = solicitarMedida(scanner, "Ingrese el ANCHO del piso en metros: ");
        double largo = solicitarMedida(scanner, "Ingrese el LARGO del piso en metros: ");
        
        double areaTotal = ancho * largo;

        System.out.println("\n--- TIPO DE PISO ---");
        System.out.println("A) Laminado porcelanato ($13.45 / m2)");
        System.out.println("B) Marmolado ($43.95 / m2)");
        System.out.println("C) Acrílico ($39.24 / m2)");
        
        double precioMetroCuadrado = 0;
        String tipoPiso = "";
        boolean opcionValida = false;

        // Validación de la opción de piso
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

        // Cálculos iniciales
        double subtotal = areaTotal * precioMetroCuadrado;

        // Confirmación de compra para aplicar descuento
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

        // Visualización de la información (Ticket)
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

    // Método robusto para validar que el usuario ingrese números válidos y positivos
    private static double solicitarMedida(Scanner scanner, String mensaje) {
        double medida = 0;
        boolean valido = false;
        
        while (!valido) {
            System.out.print(mensaje);
            try {
                medida = Double.parseDouble(scanner.nextLine().trim());
                if (medida > 0) {
                    valido = true;
                } else {
                    System.out.println(">> ERROR: La medida debe ser mayor a 0.");
                }
            } catch (NumberFormatException e) {
                System.out.println(">> ERROR: Entrada inválida. Por favor, ingrese un número (se aceptan decimales).");
            }
        }
        return medida;
    }
}