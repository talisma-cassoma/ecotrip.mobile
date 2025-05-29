import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12, // Padding interno do card
    marginHorizontal: 16,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  threeColumnRow: { // Estilo para a View que contém as 3 colunas
    flexDirection: 'row',
    
    alignItems: 'flex-start', 
    marginBottom: 10, 
  },
  iconColumn: { 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'space-between', 
     rowGap: 10, 
  },
  dashedLineWrapper: { 
     justifyContent: 'center',
     alignItems: 'center',
  },
  inputColumn: { 
    flex: 1, 
    flexDirection: 'column', 
    marginHorizontal: 10, 
  },
  autocompleteWrapper: { 
    height: 45, 
    borderRadius: 8, 
    paddingHorizontal: 10,
    overflow: 'visible', // MUITO IMPORTANTE: Permite que a lista flutue para fora
    justifyContent: 'center', 
  },
  originInputMargin: { 
    marginBottom: 10, 
  },
  input: { 
    flex: 1, 
    color: '#333',
    fontSize: 16,
    paddingVertical: 0, 
  },
});