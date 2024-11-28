# -*- coding: utf-8 -*-


class LexicalException(Exception):
	"""
	Exception raised for errors in the lexical analysis process.
	Attributes:
		message -- explanation of the error
	"""
	pass


class Token:
	def __init__(self, tipo, valor, linha):
		self.tipo = tipo
		self.valor = valor
		self.linha = linha
	
	
	def __repr__(self):
		"""
		Return a string representation of the object.
		Returns:
			str: A string in the format "(tipo valor linha)".
		"""
		
		return f"({self.tipo} {self.valor} {self.linha})"

