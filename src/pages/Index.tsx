import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  colors: string[];
  sizes: string[];
  inStock: boolean;
};

type CartItem = {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
};

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Классическая кожаная сумка',
    price: 89900,
    oldPrice: 119900,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    category: 'Сумки',
    colors: ['Черный', 'Коричневый', 'Бежевый'],
    sizes: ['One Size'],
    inStock: true,
  },
  {
    id: 2,
    name: 'Швейцарские часы Premium',
    price: 349900,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80',
    category: 'Часы',
    colors: ['Серебристый', 'Золотой', 'Розовое золото'],
    sizes: ['40мм', '42мм', '44мм'],
    inStock: true,
  },
  {
    id: 3,
    name: 'Бриллиантовое колье',
    price: 599900,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    category: 'Украшения',
    colors: ['Белое золото', 'Желтое золото'],
    sizes: ['45см', '50см'],
    inStock: true,
  },
  {
    id: 4,
    name: 'Итальянский портфель',
    price: 129900,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    category: 'Сумки',
    colors: ['Черный', 'Темно-синий'],
    sizes: ['One Size'],
    inStock: true,
  },
  {
    id: 5,
    name: 'Дизайнерские запонки',
    price: 49900,
    oldPrice: 69900,
    image: 'https://images.unsplash.com/photo-1611923134239-a5d13e2f4601?w=600&q=80',
    category: 'Аксессуары',
    colors: ['Серебро', 'Золото'],
    sizes: ['One Size'],
    inStock: true,
  },
  {
    id: 6,
    name: 'Элегантный браслет',
    price: 159900,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
    category: 'Украшения',
    colors: ['Серебро', 'Розовое золото'],
    sizes: ['S', 'M', 'L'],
    inStock: true,
  },
];

export default function Index() {
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'product' | 'about' | 'news' | 'delivery' | 'contacts' | 'faq' | 'favorites'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');

  const addToCart = (product: Product) => {
    const color = selectedColor || product.colors[0];
    const size = selectedSize || product.sizes[0];
    
    const existingItem = cart.find(
      item => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item === existingItem ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, selectedColor: color, selectedSize: size }]);
    }
    setCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(cart.map((item, i) => {
      if (i === index) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const favoriteProducts = mockProducts.filter(p => favorites.includes(p.id));

  const categories = ['Все', ...Array.from(new Set(mockProducts.map(p => p.category)))];
  const filteredProducts = selectedCategory === 'Все' 
    ? mockProducts 
    : mockProducts.filter(p => p.category === selectedCategory);

  const navigation = [
    { name: 'Главная', page: 'home' as const, icon: 'Home' },
    { name: 'Каталог', page: 'catalog' as const, icon: 'ShoppingBag' },
    { name: 'О компании', page: 'about' as const, icon: 'Info' },
    { name: 'Новости', page: 'news' as const, icon: 'Newspaper' },
    { name: 'Доставка', page: 'delivery' as const, icon: 'Truck' },
    { name: 'Контакты', page: 'contacts' as const, icon: 'Phone' },
    { name: 'FAQ', page: 'faq' as const, icon: 'HelpCircle' },
    { name: 'Избранное', page: 'favorites' as const, icon: 'Heart' },
  ];

  const renderContent = () => {
    if (currentPage === 'home') {
      return (
        <>
          <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-foreground to-foreground/80" />
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
              alt="Hero"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10 text-center text-background px-4 animate-fade-in">
              <h1 className="text-6xl md:text-7xl font-bold mb-6">Роскошь в деталях</h1>
              <p className="text-xl md:text-2xl mb-8 font-light">Эксклюзивные изделия для истинных ценителей</p>
              <Button size="lg" onClick={() => setCurrentPage('catalog')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Смотреть каталог
              </Button>
            </div>
          </section>

          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold text-center mb-12">Избранные коллекции</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockProducts.slice(0, 3).map((product) => (
                  <Card
                    key={product.id}
                    className="group cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedColor(product.colors[0]);
                      setSelectedSize(product.sizes[0]);
                      setCurrentPage('product');
                    }}
                  >
                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.oldPrice && (
                        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                          -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 left-4 bg-background/80 hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                      >
                        <Icon
                          name="Heart"
                          className={favorites.includes(product.id) ? 'fill-primary text-primary' : ''}
                        />
                      </Button>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                      <h3 className="text-2xl font-semibold mb-3">{product.name}</h3>
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-primary">{product.price.toLocaleString('ru-RU')} ₽</span>
                        {product.oldPrice && (
                          <span className="text-lg text-muted-foreground line-through">{product.oldPrice.toLocaleString('ru-RU')} ₽</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </>
      );
    }

    if (currentPage === 'catalog') {
      return (
        <section className="py-12 px-4 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold mb-8">Каталог</h1>
            
            <div className="flex flex-wrap gap-3 mb-12">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat)}
                  className="min-w-[100px]"
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  onClick={() => {
                    setSelectedProduct(product);
                    setSelectedColor(product.colors[0]);
                    setSelectedSize(product.sizes[0]);
                    setCurrentPage('product');
                  }}
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.oldPrice && (
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                        -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 left-4 bg-background/80 hover:bg-background"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                    >
                      <Icon
                        name="Heart"
                        className={favorites.includes(product.id) ? 'fill-primary text-primary' : ''}
                      />
                    </Button>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                    <h3 className="text-2xl font-semibold mb-3">{product.name}</h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-primary">{product.price.toLocaleString('ru-RU')} ₽</span>
                      {product.oldPrice && (
                        <span className="text-lg text-muted-foreground line-through">{product.oldPrice.toLocaleString('ru-RU')} ₽</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (currentPage === 'product' && selectedProduct) {
      return (
        <section className="py-12 px-4 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => setCurrentPage('catalog')} className="mb-6">
              <Icon name="ArrowLeft" className="mr-2" /> Назад к каталогу
            </Button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <Badge className="mb-4">{selectedProduct.category}</Badge>
                <h1 className="text-5xl font-bold mb-6">{selectedProduct.name}</h1>
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="text-4xl font-bold text-primary">{selectedProduct.price.toLocaleString('ru-RU')} ₽</span>
                  {selectedProduct.oldPrice && (
                    <span className="text-2xl text-muted-foreground line-through">{selectedProduct.oldPrice.toLocaleString('ru-RU')} ₽</span>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Цвет</h3>
                  <div className="flex gap-3">
                    {selectedProduct.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? 'default' : 'outline'}
                        onClick={() => setSelectedColor(color)}
                        className="min-w-[100px]"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Размер</h3>
                  <div className="flex gap-3">
                    {selectedProduct.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? 'default' : 'outline'}
                        onClick={() => setSelectedSize(size)}
                        className="min-w-[80px]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    onClick={() => addToCart(selectedProduct)}
                    className="flex-1"
                  >
                    <Icon name="ShoppingCart" className="mr-2" />
                    В корзину
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => toggleFavorite(selectedProduct.id)}
                  >
                    <Icon
                      name="Heart"
                      className={favorites.includes(selectedProduct.id) ? 'fill-primary text-primary' : ''}
                    />
                  </Button>
                </div>

                <div className="mt-12 space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Описание</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Эксклюзивное изделие премиум-класса, созданное с использованием лучших материалов и передовых технологий.
                      Каждая деталь проработана с особым вниманием к качеству и эстетике.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Характеристики</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Материал: премиум</li>
                      <li>• Производство: Италия/Швейцария</li>
                      <li>• Гарантия: 2 года</li>
                      <li>• В наличии: {selectedProduct.inStock ? 'Да' : 'Нет'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (currentPage === 'favorites') {
      return (
        <section className="py-12 px-4 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold mb-12">Избранное</h1>
            {favoriteProducts.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="Heart" size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">Нет избранных товаров</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="group cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedColor(product.colors[0]);
                      setSelectedSize(product.sizes[0]);
                      setCurrentPage('product');
                    }}
                  >
                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 left-4 bg-background/80 hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                      >
                        <Icon name="Heart" className="fill-primary text-primary" />
                      </Button>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                      <h3 className="text-2xl font-semibold mb-3">{product.name}</h3>
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-primary">{product.price.toLocaleString('ru-RU')} ₽</span>
                        {product.oldPrice && (
                          <span className="text-lg text-muted-foreground line-through">{product.oldPrice.toLocaleString('ru-RU')} ₽</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      );
    }

    const contentMap = {
      about: {
        title: 'О компании',
        content: 'Мы — эксклюзивный бутик премиум-товаров с многолетней историей. Наша миссия — предоставлять клиентам доступ к лучшим изделиям мировых брендов.'
      },
      news: {
        title: 'Новости',
        content: 'Следите за нашими новостями и специальными предложениями. Мы регулярно обновляем коллекцию эксклюзивными новинками.'
      },
      delivery: {
        title: 'Доставка',
        content: 'Бесплатная доставка по всей России при заказе от 50 000 ₽. Экспресс-доставка в течение 24 часов по Москве.'
      },
      contacts: {
        title: 'Контакты',
        content: 'Телефон: +7 (495) 123-45-67\nEmail: info@luxury-store.ru\nАдрес: Москва, ул. Тверская, д. 1'
      },
      faq: {
        title: 'FAQ',
        content: 'Здесь вы найдете ответы на часто задаваемые вопросы о наших товарах, доставке и гарантиях.'
      }
    };

    const content = contentMap[currentPage as keyof typeof contentMap];
    if (!content) return null;

    return (
      <section className="py-12 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8">{content.title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-line">{content.content}</p>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1
              className="text-3xl font-bold cursor-pointer"
              onClick={() => setCurrentPage('home')}
            >
              LUXURY
            </h1>

            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <button
                  key={item.page}
                  onClick={() => setCurrentPage(item.page)}
                  className={`text-sm hover:text-primary transition-colors ${
                    currentPage === item.page ? 'text-primary font-semibold' : ''
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
                className="relative"
              >
                <Icon name="ShoppingCart" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cart.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Icon name="Menu" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {renderContent()}

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Меню</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4 mt-8">
            {navigation.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  setCurrentPage(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 text-lg hover:text-primary transition-colors ${
                  currentPage === item.page ? 'text-primary font-semibold' : ''
                }`}
              >
                <Icon name={item.icon as any} size={20} />
                {item.name}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Корзина</SheetTitle>
          </SheetHeader>
          <div className="mt-8 space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.selectedColor}, {item.selectedSize}</p>
                          <p className="text-lg font-bold text-primary mt-2">
                            {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(index, -1)}
                            >
                              <Icon name="Minus" size={14} />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(index, 1)}
                            >
                              <Icon name="Plus" size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(index)}
                              className="ml-auto"
                            >
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-xl font-bold mb-4">
                    <span>Итого:</span>
                    <span className="text-primary">{cartTotal.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <Button className="w-full" size="lg">
                    Оформить заказ
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <footer className="bg-foreground text-background py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">LUXURY</h3>
              <p className="text-background/80">Эксклюзивные изделия премиум-класса</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <p className="text-background/80">+7 (495) 123-45-67</p>
              <p className="text-background/80">info@luxury-store.ru</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Режим работы</h4>
              <p className="text-background/80">Пн-Пт: 10:00 - 20:00</p>
              <p className="text-background/80">Сб-Вс: 11:00 - 19:00</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-background/20 text-center text-background/60">
            <p>© 2024 LUXURY. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}