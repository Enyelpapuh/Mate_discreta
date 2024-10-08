import matplotlib.pyplot as plt
from matplotlib_venn import venn3

# Definir tres conjuntos
A = set([1, 2, 3, 4])
B = set([3, 4, 5, 6])
C = set([1, 6, 7, 8])

# Crear el diagrama de Venn para tres conjuntos
venn = venn3([A, B, C], ('Conjunto A', 'Conjunto B', 'Conjunto C'))

# Mostrar el gráfico
plt.show()