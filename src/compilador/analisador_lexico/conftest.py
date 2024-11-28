import sys
from pathlib import Path

current_dir = str(Path(__file__).parent.absolute())

sys.path.insert(0, current_dir)