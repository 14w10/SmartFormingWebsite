from pathlib import Path

def print_formatted_header(header_text):
    header_text_no_fullpath = Path(header_text).name
    print("=" * len(header_text_no_fullpath))
    print(header_text_no_fullpath)
    print("=" * len(header_text_no_fullpath))

def print_saving_file_text(file_path):
    print(f"Saving file: {file_path}")
