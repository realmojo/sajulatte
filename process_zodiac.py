import os
from rembg import remove
from PIL import Image
import glob

# Ensure output directory exists
output_dir = 'assets/images/zodiac_transparent'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Get all png files
files = glob.glob('assets/images/zodiac/*.png')

print(f"Found {len(files)} images.")

for file in files:
    filename = os.path.basename(file)
    output_path = os.path.join(output_dir, filename)
    
    print(f"Processing {filename}...")
    
    try:
        input_image = Image.open(file)
        output_image = remove(input_image)
        output_image.save(output_path)
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Done.")
