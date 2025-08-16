from rest_framework import serializers


class MergePDFSerializer(serializers.Serializer):
    files = serializers.ListField(
        child=serializers.FileField(),
        min_length=2,
        max_length=10
    )


class PDFToImageSerializer(serializers.Serializer):
    pdf_file = serializers.FileField()
    output_format = serializers.ChoiceField(
        choices=['PNG', 'JPEG'],
        default='PNG'
    )
    dpi = serializers.IntegerField(
        min_value=72,
        max_value=300,
        default=150
    )


class SplitPDFSerializer(serializers.Serializer):
    pdf_file = serializers.FileField()
    pages_per_split = serializers.IntegerField(
        min_value=1,
        max_value=50,
        default=1
    )
