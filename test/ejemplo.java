public class Room{
	public void Imprimir(int a){
		System.out.println("Hola mundo"+a);
		int b=3,c=8;
		if(b==3){
			while(c!=0){
				System.out.print(c);
				c--;
			}
		}
	}
	public static void main(String[] args){
		Imprimir(4);
	}
}