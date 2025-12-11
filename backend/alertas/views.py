from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Alerta
from .serializers import AlertaSerializer


class AlertaViewSet(viewsets.ModelViewSet):
    queryset = Alerta.objects.all().select_related('curso')
    serializer_class = AlertaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtrar por atendidas/no atendidas
        atendida = self.request.query_params.get('atendida', None)
        if atendida is not None:
            atendida_bool = atendida.lower() == 'true'
            queryset = queryset.filter(atendida=atendida_bool)
        
        return queryset.order_by('-fecha')

    @action(detail=False, methods=['get'])
    def pendientes(self, request):
        """Obtener alertas pendientes"""
        alertas = self.get_queryset().filter(atendida=False)
        serializer = self.get_serializer(alertas, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def marcar_atendida(self, request, pk=None):
        """Marcar alerta como atendida"""
        alerta = self.get_object()
        alerta.atendida = True
        alerta.save()
        return Response({'message': 'Alerta marcada como atendida'})
